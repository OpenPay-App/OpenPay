#!/bin/bash
# health-check.sh — verify all core OpenPay services are up and healthy.
#
# Used as the gate before (pre) and after (post) upgrades, and as a
# standalone diagnostic. Exits non-zero if any core service is missing or
# unhealthy.
#
# Usage: ./scripts/health-check.sh [--wait]
#   --wait   wait up to 120s for services to become healthy instead of
#            failing immediately (useful right after `docker compose up -d`).
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

WAIT=0
[ "${1:-}" = "--wait" ] && WAIT=1

require_docker

# Core services that must be running & healthy.
CORE_SERVICES=(postgres redis nats hyperswitch killbill)
# Optional/profile-gated services — warn only, never fail.
OPTIONAL_SERVICES=(proxy hyperswitch-control-center nats-kb-bridge tazama-auth tazama-rule-exec tazama-rule-studio case-management mock-superposition)

failures=0

log "Health check for $(basename "$PROJECT_ROOT") @ $(current_version)"

for svc in "${CORE_SERVICES[@]}"; do
  if ! service_running "$svc"; then
    warn "✗ $svc — not running"
    failures=$((failures + 1))
    continue
  fi
  if [ "$WAIT" = "1" ]; then
    if ! wait_healthy "$svc" 120; then
      failures=$((failures + 1))
      continue
    fi
  elif service_healthy "$svc"; then
    ok "✓ $svc — healthy"
  else
    warn "✗ $svc — running but not healthy"
    failures=$((failures + 1))
  fi
done

for svc in "${OPTIONAL_SERVICES[@]}"; do
  if service_running "$svc" && ! service_healthy "$svc"; then
    warn "⚠ $svc — running but not healthy (optional service)"
  fi
done

if [ "$failures" -gt 0 ]; then
  echo ""
  warn "$failures core service(s) failed. Diagnose with: docker compose ps && docker compose logs"
  exit 1
fi

ok "All core services healthy"
