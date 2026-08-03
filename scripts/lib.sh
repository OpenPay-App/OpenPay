#!/bin/bash
# lib.sh — shared helpers for the OpenPay ops scripts (health-check, backup,
# upgrade, rollback). Source at the top of each script after resolving PROJECT_ROOT.
#
# Env overrides honored:
#   OPENPAY_BACKUP_DIR   - where backups are stored (default: <project>/.backups)
#   OPENPAY_STATE_DIR    - where upgrade/rollback state lives (default: <project>/.openpay-state)
#   OPENPAY_REPO_REMOTE  - git remote to fetch release tags from (default: origin)
set -euo pipefail

# ─── Logging ───────────────────────────────────────────────────────────────

log()  { printf '\033[36m[openpay]\033[0m %s\n' "$*"; }
ok()   { printf '\033[32m[openpay]\033[0m %s\n' "$*"; }
warn() { printf '\033[33m[openpay]\033[0m %s\n' "$*"; }
die()  { printf '\033[31m[openpay] ERROR:\033[0m %s\n' "$*" >&2; exit 1; }

# ─── Paths ─────────────────────────────────────────────────────────────────

# Resolve the repo root from this file's location (works when scripts are
# invoked from any directory, including via `make`).
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

BACKUP_DIR="${OPENPAY_BACKUP_DIR:-$PROJECT_ROOT/.backups}"
STATE_DIR="${OPENPAY_STATE_DIR:-$PROJECT_ROOT/.openpay-state}"
STATE_FILE="$STATE_DIR/state"

# ─── Prerequisite checks ───────────────────────────────────────────────────

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "'$1' is required but was not found on PATH."
}

require_docker() {
  require_cmd docker
  docker info >/dev/null 2>&1 || die "Docker daemon is not reachable. Is Docker running?"
  docker compose version >/dev/null 2>&1 || die "Docker Compose v2 (docker compose) is required."
}

require_git_repo() {
  require_cmd git
  git -C "$PROJECT_ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1 \
    || die "Not a git repository at $PROJECT_ROOT. Upgrades require the repo to be a git clone."
}

# ─── Service discovery ─────────────────────────────────────────────────────

# Named volume backing a service's data, or empty if none.
service_volume() {
  local cid svc="$1"
  cid="$(docker compose ps -q "$svc" 2>/dev/null | head -n1)"
  [ -n "$cid" ] || return 0
  docker inspect -f '{{range .Mounts}}{{if eq .Type "volume"}}{{println .Name}}{{end}}{{end}}' "$cid" 2>/dev/null \
    | sed '/^[[:space:]]*$/d' | head -n1
}

service_running() {
  local cid svc="$1"
  cid="$(docker compose ps -q "$svc" 2>/dev/null | head -n1)"
  [ -n "$cid" ] || return 1
  [ "$(docker inspect -f '{{.State.Running}}' "$cid" 2>/dev/null)" = "true" ]
}

service_healthy() {
  local cid svc="$1"
  cid="$(docker compose ps -q "$svc" 2>/dev/null | head -n1)"
  [ -n "$cid" ] || return 1
  [ "$(docker inspect -f '{{.State.Health.Status}}' "$cid" 2>/dev/null)" = "healthy" ]
}

# Wait (seconds) for a service to report healthy. Fails the script on timeout.
wait_healthy() {
  local svc="$1" timeout="${2:-120}" waited=0
  while [ "$waited" -lt "$timeout" ]; do
    service_healthy "$svc" && { ok "$svc healthy"; return 0; }
    sleep 5
    waited=$((waited + 5))
  done
  die "$svc did not become healthy within ${timeout}s. Check: docker compose logs $svc"
}

# ─── Version helpers ───────────────────────────────────────────────────────

# Current version of the checkout: nearest git tag, else the short commit.
current_version() {
  local v
  v="$(git -C "$PROJECT_ROOT" describe --tags --always 2>/dev/null || true)"
  [ -n "$v" ] && echo "$v" || echo "unknown"
}

# Best candidate for "latest" release tag (v-prefixed preferred, any fallback).
latest_tag() {
  local t
  t="$(git -C "$PROJECT_ROOT" tag --sort=-v:refname --list 'v*' 2>/dev/null | head -n1)"
  [ -n "$t" ] || t="$(git -C "$PROJECT_ROOT" tag --sort=-creatordate 2>/dev/null | head -n1)"
  echo "$t"
}

# Hyperswitch router image tag pinned in docker-compose.yml (e.g. v1.125.0).
hyperswitch_image_tag() {
  grep -oE 'juspaydotin/hyperswitch-router:[^[:space:]"]+' "$PROJECT_ROOT/docker-compose.yml" \
    | head -n1 | cut -d: -f2 || true
}

# ─── State ─────────────────────────────────────────────────────────────────

write_state() {
  mkdir -p "$STATE_DIR"
  : > "$STATE_FILE"
  for line in "$@"; do
    echo "$line" >> "$STATE_FILE"
  done
}

# ─── Git helpers ───────────────────────────────────────────────────────────

git_fetch_tags() {
  local remote="${OPENPAY_REPO_REMOTE:-origin}"
  git -C "$PROJECT_ROOT" fetch --tags "$remote" >/dev/null 2>&1 \
    || warn "Could not fetch tags from '$remote'. Using locally available tags."
}

# Verifies a target tag exists; dies otherwise.
require_tag() {
  local tag="$1"
  git -C "$PROJECT_ROOT" rev-parse -q --verify "refs/tags/$tag" >/dev/null 2>&1 \
    || die "Tag '$tag' not found. Run: git fetch --tags"
}
