#!/bin/bash
# release.sh — local release orchestrator (mirror of .github/workflows/release.yml).
#
# Validates the SemVer tag, classifies the bump, runs the environment smoke
# gate, then produces + cosign-signs the release bundle. Useful for maintainers
# who want to run the release pipeline locally before pushing the tag.
#
# Usage:
#   ./scripts/release.sh v1.2.0                 full release flow
#   ./scripts/release.sh v1.2.0 --skip-smoke   skip ci-smoke (e.g. docker absent)
#   ./scripts/release.sh v1.2.0 --out <dir>    artifact output dir (default .releases/<tag>)
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

VERSION="${1:?usage: release.sh <vMAJOR.MINOR.PATCH> [--skip-smoke] [--out <dir>]}"
SKIP_SMOKE=0
OUT_DIR=""
while [ $# -gt 0 ]; do
  case "$1" in
    --skip-smoke) SKIP_SMOKE=1 ;;
    --out) OUT_DIR="$2"; shift ;;
    --*) warn "unknown flag: $1" ;;
  esac
  shift
done

require_cmd git
require_git_repo

# ─── 1. Validate version + classify bump ────────────────────────────────────
log "Validating $VERSION …"
bash "$SCRIPT_DIR/version.sh" validate "$VERSION"

PREV="$(git -C "$PROJECT_ROOT" tag --sort=-v:refname --list 'v*' \
  | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' | grep -vxF "$VERSION" | head -n1 || true)"
if [ -n "$PREV" ]; then
  BUMP="$(bash "$SCRIPT_DIR/version.sh" diff "$VERSION" "$PREV")"
else
  BUMP="major"
fi
log "Release $VERSION ($BUMP bump, previous: ${PREV:-none})"
if [ "$BUMP" = "major" ]; then
  warn "MAJOR release — confirm DB migrations and docker-compose contract changes are included."
fi

# ─── 2. Clean working tree guard ─────────────────────────────────────────────
if [ -n "$(git -C "$PROJECT_ROOT" status --porcelain)" ]; then
  warn "Working tree is dirty. Release bundles only tracked files, but ensure " \
    "uncommitted changes are intentional before tagging."
fi

# ─── 3. Tag must exist for artifact snapshot ────────────────────────────────
if ! git -C "$PROJECT_ROOT" rev-parse -q --verify "refs/tags/$VERSION" >/dev/null 2>&1; then
  warn "Tag '$VERSION' does not exist yet — creating the bundle requires it."
  warn "  git tag $VERSION && git push origin $VERSION"
  die "Aborting (no tag)."
fi

# ─── 4. Environment smoke gate ──────────────────────────────────────────────
if [ "$SKIP_SMOKE" = "1" ]; then
  warn "Skipping ci-smoke (--skip-smoke)"
else
  log "Running environment smoke gate …"
  bash "$SCRIPT_DIR/ci-smoke.sh"
fi

# ─── 5. Release bundle (source + SBOM + provenance + checksums) ─────────────
OUT_DIR="${OUT_DIR:-$PROJECT_ROOT/.releases/$VERSION}"
mkdir -p "$OUT_DIR"
bash "$SCRIPT_DIR/release-artifacts.sh" "$VERSION" "$OUT_DIR" \
  "${OPENPAY_DASHBOARD_IMAGE:-ghcr.io/OpenPay-App/openpay/dashboard:$VERSION}"

# ─── 6. Sign the source snapshot ────────────────────────────────────────────
if command -v cosign >/dev/null 2>&1; then
  log "Signing release.tar.gz with cosign …"
  cosign sign-blob --yes "$OUT_DIR/release.tar.gz" \
    --output-signature "$OUT_DIR/release.tar.gz.sig" \
    --output-certificate "$OUT_DIR/release.tar.gz.pem"
  cosign verify-blob --certificate "$OUT_DIR/release.tar.gz.pem" \
    --signature "$OUT_DIR/release.tar.gz.sig" "$OUT_DIR/release.tar.gz"
  (cd "$OUT_DIR" && sha256sum release.tar.gz.sig release.tar.gz.pem >> release.sha256)
else
  warn "cosign not found — artifacts are unsigned. Install: https://docs.sigstore.dev/cosign/system_config/installation/"
fi

ok "Release bundle ready: $OUT_DIR"
echo ""
echo "Artifacts:"
ls -la "$OUT_DIR"
echo ""
echo "Next (CI does this automatically on tag push):"
echo "  git push origin $VERSION"
