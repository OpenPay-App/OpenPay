#!/bin/bash
# migrate-hyperswitch-db.sh
#
# Applies the Hyperswitch Diesel DB migrations to the local PostgreSQL instance.
#
# WHY THIS IS NEEDED:
#   The email-enabled router image (v1.125.0) requires ~493 tables (users,
#   user_authentication_methods, merchant_account, ...). The old stripped
#   ":standalone" image tolerated an empty database, so a fresh clone boots
#   with ZERO tables -> every login shows "Invalid Link or session expired"
#   and every email-gated route 500s with "relation ... does not exist".
#
# Usage:  ./scripts/migrate-hyperswitch-db.sh
# Env:    HYPERSWITCH_VERSION (default v1.125.0), DB_HOST, DB_PORT, DB_NAME
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

HYPERSWITCH_VERSION="${HYPERSWITCH_VERSION:-v1.125.0}"
MIG_DIR="$PROJECT_ROOT/.cache/hyperswitch-migrations"
TARBALL="$MIG_DIR/hyperswitch-$HYPERSWITCH_VERSION.tar.gz"
CACHE_DIR="$MIG_DIR/extracted-$HYPERSWITCH_VERSION"

# Stage dir for the Docker bind-mount. On Windows this must live on a drive
# Docker Desktop shares - C: is always shared, project drives like D: often
# are NOT (Docker Desktop > Settings > Resources > File Sharing).
STAGE_DIR="${TMPDIR:-${TEMP:-/tmp}}/hs-mig-$HYPERSWITCH_VERSION"

# DB creds from root .env (fall back to compose defaults)
DB_USER="$(grep -E '^POSTGRES_USER=' .env 2>/dev/null | cut -d= -f2- | tr -d '\r' || true)"
DB_PASSWORD="$(grep -E '^POSTGRES_PASSWORD=' .env 2>/dev/null | cut -d= -f2- | tr -d '\r' || true)"
DB_HOST="${DB_HOST:-core-postgres}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-hyperswitch}"
: "${DB_USER:=coreplatform}"
: "${DB_PASSWORD:=localdev123}"

docker inspect core-postgres >/dev/null 2>&1 || { echo "ERROR: core-postgres is not running. Start the stack first: docker compose up -d postgres"; exit 1; }
NETWORK="$(docker inspect core-postgres --format '{{range $k,$v := .NetworkSettings.Networks}}{{$k}}{{end}}' 2>/dev/null || echo 'core-financial-platform_core-net')"

echo "==> Ensuring Hyperswitch $HYPERSWITCH_VERSION migrations are available"
if [ ! -d "$CACHE_DIR/migrations" ]; then
  mkdir -p "$CACHE_DIR"
  if [ ! -f "$TARBALL" ]; then
    echo "    Downloading hyperswitch $HYPERSWITCH_VERSION (~114 MB, one-time)..."
    curl -sL -m 600 --retry 3 -o "$TARBALL" "https://github.com/juspay/hyperswitch/archive/refs/tags/$HYPERSWITCH_VERSION.tar.gz"
  fi
  echo "    Extracting migrations..."
  tar -xzf "$TARBALL" -C "$CACHE_DIR" \
    "hyperswitch-${HYPERSWITCH_VERSION#v}/migrations" \
    "hyperswitch-${HYPERSWITCH_VERSION#v}/diesel.toml"
  mv "$CACHE_DIR/hyperswitch-${HYPERSWITCH_VERSION#v}/migrations" "$CACHE_DIR/migrations"
  mv "$CACHE_DIR/hyperswitch-${HYPERSWITCH_VERSION#v}/diesel.toml" "$CACHE_DIR/diesel.toml" 2>/dev/null || true
  rm -rf "$CACHE_DIR/hyperswitch-${HYPERSWITCH_VERSION#v}"
fi

COUNT="$(ls "$CACHE_DIR/migrations" | wc -l)"
echo "==> Found $COUNT migrations. Applying to $DB_HOST:$DB_PORT/$DB_NAME ..."

# Stage migrations in the OS temp dir (shared with Docker Desktop on Windows),
# then bind-mount that instead of the project dir.
echo "==> Staging migrations to $STAGE_DIR ..."
mkdir -p "$STAGE_DIR"
rm -rf "$STAGE_DIR/migrations"
cp -r "$CACHE_DIR/migrations" "$STAGE_DIR/migrations"

# Windows git-bash: Docker Desktop needs a Windows-style path for bind mounts
MOUNT_SRC="$(cygpath -w "$STAGE_DIR" 2>/dev/null || echo "$STAGE_DIR")"

docker run --rm \
  --network "$NETWORK" \
  -v "$MOUNT_SRC:/app" \
  debian:trixie-slim bash -c "
    ls /app/migrations >/dev/null 2>&1 || { echo 'ERROR: migration files not visible at /app/migrations - bind mount failed. On Windows ensure the temp drive is shared in Docker Desktop > Settings > Resources > File Sharing.'; exit 1; } &&
    apt-get update -qq >/dev/null 2>&1 &&
    apt-get install -y -qq curl ca-certificates xz-utils >/dev/null 2>&1 &&
    curl -LsSf https://github.com/diesel-rs/diesel/releases/download/v2.3.5/diesel_cli-installer.sh -o /tmp/install.sh &&
    bash /tmp/install.sh >/dev/null 2>&1 &&
    export PATH=/root/.cargo/bin:\$PATH &&
    diesel migration run \
      --database-url 'postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}' \
      --migration-dir /app/migrations
  "

echo "==> Done. Tables now:"
docker exec "$DB_HOST" psql -U "$DB_USER" -d "$DB_NAME" -c "SELECT count(*) FROM pg_tables WHERE schemaname='public';"
