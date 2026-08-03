#!/bin/bash
# upgrade.sh — semi-automated self-hosted upgrade for OpenPay (Option B).
#
# Safety envelope for a payments platform:
#   pre-flight → backup → migrate-guard → apply → verify → auto-rollback
#
# What it does, in order:
#   1. Resolves the current + target release (git tags).
#   2. Pre-upgrade health check (aborts on a broken stack).
#   3. Backs up PostgreSQL + Redis + NATS (scripts/backup.sh).
#   4. Records the previous version + backup location in .openpay-state/.
#   5. Checks out the target tag and validates the new compose file.
#   6. Runs Hyperswitch migrations ONLY if the router image version changed.
#   7. Pulls images, starts the stack, waits for health.
#   8. On ANY failure → automatic rollback to the previous version + backup.
#
# Usage: ./scripts/upgrade.sh [<version>] [options]
#   <version>   target release tag (default: latest)
#   --skip-backup       skip the backup step (not recommended)
#   --skip-migrations   skip the migration-guard step
#   --skip-rollback     never auto-rollback on failure (manual only)
#   --dry-run           print the plan and exit without changing anything
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

TARGET=""
SKIP_BACKUP=0
SKIP_MIGRATIONS=0
SKIP_ROLLBACK=0
DRY_RUN=0
ROLLING_BACK=0
UPGRADE_STARTED=0

while [ $# -gt 0 ]; do
  case "$1" in
    --skip-backup)     SKIP_BACKUP=1; shift ;;
    --skip-migrations) SKIP_MIGRATIONS=1; shift ;;
    --skip-rollback)   SKIP_ROLLBACK=1; shift ;;
    --dry-run)         DRY_RUN=1; shift ;;
    --*) die "Unknown option: $1" ;;
    *) [ -z "$TARGET" ] || die "Multiple versions given: $TARGET and $1"; TARGET="$1"; shift ;;
  esac
done

# ─── Auto-rollback trap ────────────────────────────────────────────────────
rollback_on_error() {
  local rc=$?
  if [ "$UPGRADE_STARTED" = "1" ] && [ "$ROLLING_BACK" = "0" ] && [ "$SKIP_ROLLBACK" = "0" ]; then
    ROLLING_BACK=1
    warn "Upgrade failed (exit $rc). Rolling back to $PREVIOUS_VERSION …"
    "$PROJECT_ROOT/scripts/rollback.sh" --to "$PREVIOUS_VERSION" --backup "$BACKUP" --yes \
      || warn "Automatic rollback also failed — manual intervention required. See docs/self-hosting/upgrades."
  fi
  exit "$rc"
}
trap rollback_on_error ERR

# ─── Pre-flight ────────────────────────────────────────────────────────────
require_docker
require_git_repo

log "OpenPay upgrade — current version: $(current_version)"

# ─── Resolve target ────────────────────────────────────────────────────────
PREVIOUS_VERSION="$(current_version)"

git_fetch_tags
if [ -z "$TARGET" ] || [ "$TARGET" = "latest" ]; then
  TARGET="$(latest_tag)"
fi
[ -n "$TARGET" ] || die "No release tags found. Fetch them first: git fetch --tags"
require_tag "$TARGET"

if [ "$TARGET" = "$PREVIOUS_VERSION" ]; then
  ok "Already running $TARGET — nothing to do."
  exit 0
fi

HYPERSWITCH_BEFORE="$(hyperswitch_image_tag)"

# ─── Plan ──────────────────────────────────────────────────────────────────
echo ""
log "Upgrade plan:"
echo "  From:     $PREVIOUS_VERSION (hyperswitch $HYPERSWITCH_BEFORE)"
echo "  To:       $TARGET"
echo "  Backup:   $([ "$SKIP_BACKUP" = "1" ] && echo "SKIPPED" || echo "yes")"
echo "  Migrations: $([ "$SKIP_MIGRATIONS" = "1" ] && echo "SKIPPED" || echo "auto (on image change)")"
echo "  Rollback: $([ "$SKIP_ROLLBACK" = "1" ] && echo "manual only" || echo "automatic on failure")"
echo ""
if [ "$DRY_RUN" = "1" ]; then
  ok "Dry run — no changes made."
  exit 0
fi

# ─── 1. Pre-upgrade health check ───────────────────────────────────────────
log "Pre-upgrade health check…"
if ! "$PROJECT_ROOT/scripts/health-check.sh"; then
  die "Pre-upgrade health check failed. Fix the stack first, or run: ./scripts/rollback.sh"
fi

# ─── 2. Backup ─────────────────────────────────────────────────────────────
if [ "$SKIP_BACKUP" = "1" ]; then
  warn "Skipping backup (--skip-backup)."
  BACKUP=""
else
  "$PROJECT_ROOT/scripts/backup.sh"
  BACKUP="$(ls -dt "$BACKUP_DIR"/*/ | head -n1)"
  BACKUP="${BACKUP%/}"
  [ -d "$BACKUP" ] || die "Backup step produced no directory in $BACKUP_DIR — aborting."
fi

UPGRADE_STARTED=1

# ─── 3. Record state (drives rollback) ─────────────────────────────────────
write_state \
  "previous_version=$PREVIOUS_VERSION" \
  "target_version=$TARGET" \
  "backup_dir=$BACKUP" \
  "upgrade_started=$(date -u +%Y-%m-%dT%H:%M:%SZ)"

# ─── 4. Checkout target ────────────────────────────────────────────────────
log "Checking out $TARGET …"
if ! git -C "$PROJECT_ROOT" checkout "$TARGET" 2>&1; then
  die "Checkout of $TARGET failed. You may have uncommitted local changes — commit or stash them, then retry."
fi
ok "Now on $TARGET"

# ─── 5. Validate new compose file ──────────────────────────────────────────
log "Validating docker-compose.yml…"
docker compose config -q || die "docker-compose.yml for $TARGET is invalid."

# ─── 6. Migration guard (Hyperswitch schema) ───────────────────────────────
HYPERSWITCH_AFTER="$(hyperswitch_image_tag)"
if [ "$SKIP_MIGRATIONS" = "1" ]; then
  warn "Skipping migrations (--skip-migrations)."
elif [ -n "$HYPERSWITCH_BEFORE" ] && [ "$HYPERSWITCH_BEFORE" = "$HYPERSWITCH_AFTER" ]; then
  ok "Hyperswitch router unchanged ($HYPERSWITCH_AFTER) — no migrations required."
else
  log "Hyperswitch router $HYPERSWITCH_BEFORE → ${HYPERSWITCH_AFTER:-unknown} — applying DB migrations…"
  "$PROJECT_ROOT/scripts/migrate-hyperswitch-db.sh"
  ok "Migrations applied."
fi

# ─── 7. Apply ──────────────────────────────────────────────────────────────
log "Pulling images…"
docker compose pull

log "Starting the stack…"
docker compose up -d

# ─── 8. Verify ─────────────────────────────────────────────────────────────
log "Post-upgrade health check…"
"$PROJECT_ROOT/scripts/health-check.sh" --wait

write_state \
  "previous_version=$PREVIOUS_VERSION" \
  "current_version=$TARGET" \
  "backup_dir=$BACKUP" \
  "upgrade_completed=$(date -u +%Y-%m-%dT%H:%M:%SZ)"

trap - ERR
ok "Upgrade complete — now running $TARGET."
echo ""
echo "If anything looks wrong:"
echo "  ./scripts/rollback.sh          # restores $PREVIOUS_VERSION + data"
echo "  make rollback"
