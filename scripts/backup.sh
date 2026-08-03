#!/bin/bash
# backup.sh — snapshot all OpenPay persistent data before an upgrade.
#
# Captures:
#   1. A logical PostgreSQL dump (pg_dumpall) — portable, restore into any Postgres.
#   2. Full named-volume tarballs (postgres-data, redis-data, nats-data) — the
#      exact byte-level state, used by rollback for a faithful restore.
#
# Output lands in <project>/.backups/<version>-<timestamp>/ (override with
# OPENPAY_BACKUP_DIR). Backups are plain files; copy the directory anywhere
# before upgrading.
#
# Usage: ./scripts/backup.sh [--label <name>]
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

LABEL=""
while [ $# -gt 0 ]; do
  case "$1" in
    --label) LABEL="$2"; shift 2 ;;
    *) die "Unknown argument: $1 (usage: backup.sh [--label <name>])" ;;
  esac
done

require_docker

VERSION="$(current_version)"
TS="$(date +%Y%m%d-%H%M%S)"
DEST="$BACKUP_DIR/${LABEL:-$VERSION}-$TS"
mkdir -p "$DEST"

log "Backing up OpenPay ($VERSION) → $DEST"

# ─── 1. Logical PostgreSQL dump ────────────────────────────────────────────
if service_running postgres; then
  DB_USER="${POSTGRES_USER:-coreplatform}"
  log "Dumping PostgreSQL (pg_dumpall)…"
  docker exec core-postgres pg_dumpall -U "$DB_USER" --clean --if-exists > "$DEST/postgres-dumpall.sql" \
    || die "PostgreSQL dump failed. Check: docker compose logs postgres"
  ok "✓ postgres-dumpall.sql ($(du -h "$DEST/postgres-dumpall.sql" | cut -f1))"
else
  warn "postgres is not running — skipping logical dump (volume tarball still captured)."
fi

# ─── 2. Named-volume tarballs (postgres, redis, nats) ─────────────────────
tar_volume() {
  local svc="$1" name="$2" vol
  vol="$(service_volume "$svc")"
  if [ -z "$vol" ]; then
    warn "no named volume found for '$svc' — skipping ${name}.tgz"
    return
  fi
  log "Taring volume '$vol' → ${name}.tgz …"
  # On Windows/git-bash the backup dir must be a path Docker Desktop can bind-mount
  # (the OS temp dir is shared; project drives often are not).
  local mount_src
  mount_src="$(cygpath -w "$DEST" 2>/dev/null || echo "$DEST")"
  docker run --rm \
    -v "$vol:/data:ro" \
    -v "$mount_src:/backup" \
    alpine:3.20 tar czf "/backup/$name.tgz" -C /data . \
    || die "Volume tar for '$vol' failed. On Windows ensure '$DEST' lives on a Docker-shared drive."
  ok "✓ $name.tgz ($(du -h "$DEST/$name.tgz" | cut -f1))"
}

tar_volume postgres postgres-data
tar_volume redis    redis-data
tar_volume nats     nats-data

# ─── 3. Manifest ───────────────────────────────────────────────────────────
{
  echo "openpay_version: $VERSION"
  echo "created:         $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "files:"
  ls -1 "$DEST"
} > "$DEST/MANIFEST.txt"

ok "Backup complete: $DEST"
echo ""
echo "Copy this directory somewhere off-box before upgrading (e.g. object storage):"
echo "  cp -r $DEST /your/off-site/backups/"
