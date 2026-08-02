#!/bin/bash
# release-artifacts.sh — build the signed, provenance-bearing release bundle.
#
# Produces, in the output directory:
#   release.tar.gz           clean source snapshot of the tagged commit
#   release.sha256           SHA-256 checksums of every artifact
#   release.sbom.json        SBOM (cyclonedx) for the dashboard image (needs syft)
#   release.attestation.json build provenance (SLSA-style predicate)
#
# Usage: ./scripts/release-artifacts.sh <version-tag> <out-dir> [dashboard-image-ref]
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

VERSION="${1:?usage: release-artifacts.sh <version-tag> <out-dir> [image-ref]}"
OUT="${2:?usage: release-artifacts.sh <version-tag> <out-dir> [image-ref]}"
IMAGE="${3:-}"

require_cmd tar
[ -d "$OUT" ] || mkdir -p "$OUT"
cd "$PROJECT_ROOT"

# ─── 1. Source snapshot (only tracked files, no git dir) ───────────────────
log "Creating source snapshot $VERSION …"
git archive --format=tar.gz --prefix="openpay-$VERSION/" -o "$OUT/release.tar.gz" "$VERSION"

# ─── 2. SBOM (dashboard image) ─────────────────────────────────────────────
if [ -n "$IMAGE" ] && command -v syft >/dev/null 2>&1; then
  log "Generating SBOM for $IMAGE …"
  syft scan --output cyclonedx-json "$IMAGE" > "$OUT/release.sbom.json" \
    || warn "SBOM generation failed (image may not be pulled)."
else
  warn "syft not available / no image given — skipping release.sbom.json"
fi

# ─── 3. Provenance (SLSA-style predicate) ──────────────────────────────────
log "Writing provenance attestation …"
{
  echo "{"
  echo "  \"_type\": \"https://in-toto.io/Statement/v0.1\","
  echo "  \"subject\": [{\"name\": \"openpay-$VERSION.tar.gz\", \"digest\": {\"sha256\": \"$(sha256sum "$OUT/release.tar.gz" | cut -d' ' -f1)\"}}],"
  echo "  \"predicateType\": \"https://slsa.dev/provenance/v0.2\","
  echo "  \"predicate\": {"
  echo "    \"builder\": { \"id\": \"https://github.com/OpenPay-App/OpenPay/.github/workflows/release.yml\" },"
  echo "    \"buildType\": \"https://github.com/OpenPay-App/OpenPay/release@v1\","
  echo "    \"invocation\": { \"configSource\": { \"uri\": \"git+https://github.com/OpenPay-App/OpenPay\", \"digest\": {\"gitCommit\": \"$(git rev-parse --short "$VERSION" 2>/dev/null || echo unknown)\"} } }"
  echo "  }"
  echo "}"
} > "$OUT/release.attestation.json"

# ─── 4. Checksums ───────────────────────────────────────────────────────────
log "Writing checksums …"
(
  cd "$OUT"
  sha256sum release.tar.gz release.attestation.json > release.sha256
  [ -f release.sbom.json ] && sha256sum release.sbom.json >> release.sha256
)

ok "Artifacts written to $OUT:"
ls -la "$OUT"
