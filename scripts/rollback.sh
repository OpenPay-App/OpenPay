#!/bin/bash
# rollback.sh — restore the previous release + its data snapshot after a failed
# (or unwanted) upgrade.
#
# Steps:
#   1. Resolve the version to roll back to (state file, or --to).
#   2. Resolve the backup to restore from (state file, or --backup).
#   3. Stop the stack, checkout the previous version.
#   4. Restore postgres / redis / nats named volumes from the backup tarballs.
#   5. Pull images, start the stack, wait for health.
#
# The stack is taken DOWN during this operation — schedule a maintenance window.
#
# Usage: ./scripts/rollback.sh [--to <version>] [--backup <dir>] [--yes]
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

TO_VERSION=""
BACKUP=""
ASSUME_YES=0

while [ $# -gt 0 ]; do
  case "$1" in
    --to)     TO_VERSION="$2"; shift 2 ;;
    --backup) BACKUP="$2"; shift 2 ;;
    --yes)    ASSUME_YES=1; shift ;;
    *) die "Unknown argument: $1" ;;
  esac
done

require_docker
require_git_repo

# ─── Resolve target version & backup ───────────────────────────────────────
if [ -z "$TO_VERSION" ] && [ -f "$STATE_FILE" ]; then
  TO_VERSION="$(grep '^previous_version=' "$STATE_FILE" | cut -d= -f2 || true)"
fi
if [ -z "$BACKUP" ] && [ -f "$STATE_FILE" ]; then
  BACKUP="$(grep '^backup_dir=' "$STATE_FILE" | cut -d= -f2 || true)"
fi

[ -n "$TO_VERSION" ] || die "No previous version found. Pass one explicitly: rollback.sh --to <version>"
[ -n "$BACKUP" ] || die "No backup found. Pass one explicitly: rollback.sh --backup <dir>"

require_tag "$TO_VERSION"
[ -d "$BACKUP" ] || die "Backup directory not found: $BACKUP"
[ -f "$BACKUP/postgres-data.tgz" ] || [ -f "$BACKUP/postgres-dumpall.sql" ] \
  || die "Backup directory does not contain a postgres backup: $BACKUP"

echo ""
log "Rollback plan:"
echo "  Version:  $(current_version) → $TO_VERSION"
echo "  Restore:  $BACKUP"
echo "  Effect:   stack will be stopped and postgres/redis/nats restored."
echo ""

if [ "$ASSUME_YES" != "1" ]; then
  if [ ! -t 0 ]; then
    die "Not an interactive terminal — pass --yes to run non-interactively."
  fi
  read -r -p "Continue? [y/N] " ans
  case "$ans" in
    y|Y) ;;
    *) echo "Aborted."; exit 1 ;;
  esac
fi

# ─── Restore volume from tarball ───────────────────────────────────────────
restore_volume() {
  local svc="$1" name="$2" vol mount_src
  vol="$(service_volume "$svc")"
  [ -n "$vol" ] || { warn "no named volume for '$svc' — skipping ${name}.tgz"; return 0; }
  [ -f "$BACKUP/$name.tgz" ] || { warn "missing $BACKUP/$name.tgz — skipping"; return 0; }

  log "Restoring volume '$vol' from ${name}.tgz …"
  mount_src="$(cygpath -w "$BACKUP" 2>/dev/null || echo "$BACKUP")"
  docker run --rm \
    -v "$vol:/data" \
    -v "$mount_src:/backup" \
    alpine:3.20 sh -c 'find /data -mindepth 1 -maxdepth 1 -exec rm -rf {} + && tar xzf /backup/'"$name"'.tgz -C /data' \
    || die "Volume restore of '$vol' failed."
  ok "✓ $name restored"
}

# ─── Execute ───────────────────────────────────────────────────────────────
log "Stopping the stack (volumes are preserved)…"
docker compose down

log "Checking out $TO_VERSION …"
git -C "$PROJECT_ROOT" checkout "$TO_VERSION"

restore_volume postgres postgres-data
restore_volume redis    redis-data
restore_volume nats     nats-data

log "Pulling images for $TO_VERSION …"
docker compose pull

log "Starting the stack…"
docker compose up -d

log "Waiting for core services to become healthy…"
./scripts/health-check.sh --wait

write_state \
  "previous_version=$TO_VERSION" \
  "current_version=$TO_VERSION" \
  "backup_dir=$BACKUP"

ok "Rollback complete — running $TO_VERSION with restored data."
