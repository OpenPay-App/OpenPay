#!/bin/bash
# validate-config.sh — validate environment configuration across every service.
#
# Checks that all required variables exist in each .env/.env.local file, that
# URLs are well-formed, and that no placeholder secrets are committed. Used in
# CI (ci.yml) and available locally before `make up`.
#
# Usage: ./scripts/validate-config.sh
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

# ─── Required variables per env file ────────────────────────────────────────
# format: "path|VAR1 VAR2 ..."
REQUIRED=(
  ".env|COMPOSE_PROJECT_NAME POSTGRES_PASSWORD"
  ".env|HYPERSWITCH_ADMIN_API_KEY HYPERSWITCH_JWT_SECRET"
  "event-bus/.env|NATS_URL"
  "payment-system/hyperswitch/.env|ROUTER__SECRETS__JWT_SECRET"
  "payment-system/nats-kb-bridge/.env|NATS_URL"
  "monitoring-and-rules/.env|TAZAMA_AUTH_URL"
)

# URLs that must parse as http(s). NATS_URL is excluded (nats:// scheme is valid).
URL_VARS="HYPERSWITCH_URL HYPERSWITCH_URL_TEST HYPERSWITCH_URL_LIVE HYPERSWITCH_API_URL KILLBILL_API_URL TAZAMA_API_URL TAZAMA_AUTH_URL HYPERSWITCH_DASHBOARD_URL HYPERSWITCH_PUBLIC_API_URL KINDE_ISSUER_URL KINDE_SITE_URL"
# Placeholder markers that must NOT appear in a production build.
PLACEHOLDERS=("your_" "your-" "your." "generate_a_random" "localdev123" "changeme")

DASHBOARD_ENV="apps/merchant-dashboard/.env.local"
DASHBOARD_REQUIRED="KINDE_CLIENT_ID KINDE_CLIENT_SECRET KINDE_ISSUER_URL"
DASHBOARD_URL_VARS="KINDE_ISSUER_URL KINDE_SITE_URL KINDE_POST_LOGIN_REDIRECT_URL HYPERSWITCH_URL_TEST HYPERSWITCH_URL_LIVE"

failures=0

check_file() {
  local file="$1"
  [ -f "$file" ] || { warn "missing $file (run: make init)"; failures=$((failures + 1)); return; }
}

require_vars() {
  local file="$1"; shift
  for v in "$@"; do
    local val
    val="$(grep -E "^${v}=" "$file" 2>/dev/null | head -n1 | cut -d= -f2- | tr -d '\r' || true)"
    if [ -z "$val" ] || [ "${val#\#}" != "$val" ]; then
      warn "$file: '$v' is missing or empty"
      failures=$((failures + 1))
    fi
  done
}

validate_urls() {
  local file="$1"; shift
  for v in "$@"; do
    local val
    val="$(grep -E "^${v}=" "$file" 2>/dev/null | head -n1 | cut -d= -f2- | tr -d '\r' || true)"
    [ -n "$val" ] || continue
    case "$val" in
      http://*|https://*) ;;
      *) warn "$file: '$v' is not a valid URL: $val"; failures=$((failures + 1)) ;;
    esac
  done
}

check_placeholders() {
  local file="$1" mode="${2:-dev}"
  [ "$mode" = "prod" ] || return 0
  local content
  content="$(cat "$file" 2>/dev/null || true)"
  for p in "${PLACEHOLDERS[@]}"; do
    if echo "$content" | grep -qi "$p"; then
      warn "$file: contains placeholder '$p' (refusing production config)"
      failures=$((failures + 1))
    fi
  done
}

log "Validating environment configuration"

for entry in "${REQUIRED[@]}"; do
  file="${entry%%|*}"; vars="${entry#*|}"
  check_file "$file"
  [ -f "$file" ] && require_vars "$file" $vars
done

# Dashboard env (uses .env.local, gitignored)
if [ -f "$DASHBOARD_ENV" ]; then
  require_vars "$DASHBOARD_ENV" $DASHBOARD_REQUIRED
  validate_urls "$DASHBOARD_ENV" $DASHBOARD_URL_VARS
fi

# URL validation on any env file that declares URL vars (templates linted too)
for f in .env .env.example .env.production.example; do
  [ -f "$f" ] && validate_urls "$f" $URL_VARS
done

# Placeholder rejection ONLY for a real production .env (templates are
# placeholders by definition and must not be rejected).
if [ -f .env ]; then
  ENV_MODE="$(grep -E '^ENVIRONMENT=' .env | head -n1 | cut -d= -f2- | tr -d '\r')"
  if [ "$ENV_MODE" = "production" ]; then
    check_placeholders ".env" prod
  fi
fi

if [ "$failures" -gt 0 ]; then
  echo ""
  die "$failures configuration issue(s) found."
fi
ok "Configuration valid"
