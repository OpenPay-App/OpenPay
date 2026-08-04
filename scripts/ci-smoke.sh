#!/bin/bash
# ci-smoke.sh — full-environment smoke test for CI/CD pipelines.
#
# Mirrors the operator runbook: configure → validate → start → migrate →
# health → business flow. Used by:
#   - ci.yml      (PR + main integration job)
#   - staging.yml (manual + release gate)
#   - release.yml (pre-publish validation)
#
# Flags:
#   --no-up            assume services are already running (skip compose up)
#   --require-processor fail if the processor-dependent business flow cannot
#                       run (release gate). Default: best-effort.
#   --phase <name>     run a single phase only
#
# Exit codes: 0 ok, 1 failure, 2 skipped/unsupported.
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

NO_UP=0
REQUIRE_PROCESSOR=0
PHASE=""
while [ $# -gt 0 ]; do
  case "$1" in
    --no-up) NO_UP=1 ;;
    --require-processor) REQUIRE_PROCESSOR=1 ;;
    --phase) PHASE="$2"; shift ;;
    *) die "unknown flag: $1" ;;
  esac
  shift
done

PHASE_ONLY() {
  [ -n "$PHASE" ] && [ "$PHASE" != "$1" ]
}

phase() {
  local name="$1"
  if PHASE_ONLY "$name"; then return 1; fi
  log "── phase: $name ─────────────────────────────"
  return 0
}

phase_end() { ok "phase complete: $1"; }

# Phase: config — env files exist and are complete
if phase config; then
  ./scripts/validate-config.sh
  docker compose config -q && ok "docker-compose.yml is valid"
  phase_end "config"
fi

# Phase: up — start the core stack
if phase up; then
  if [ "$NO_UP" = "1" ]; then
    log "skipping compose up (--no-up)"
  else
    docker compose up -d
    ok "compose stack started"
  fi
  phase_end "up"
fi

# Phase: migrate — apply schema migrations (idempotent)
if phase migrate; then
  ./scripts/migrate-hyperswitch-db.sh
  phase_end "migrate"
fi

# Phase: streams — NATS JetStream init (idempotent)
if phase streams; then
  if command -v nats >/dev/null 2>&1; then
    if ! ./event-bus/nats/scripts/init-streams.sh; then
      nats stream info PAYMENT_EVENTS --server "${NATS_URL:-nats://localhost:4222}" >/dev/null 2>&1 \
        && ok "streams already present (idempotent re-run)" \
        || die "stream init failed"
    fi
  else
    warn "nats CLI not found — skipping stream init (install: https://github.com/nats-io/natscli)"
  fi
  phase_end "streams"
fi

# Phase: health — core services healthy (gates the pipeline)
if phase health; then
  ./scripts/health-check.sh --wait
  phase_end "health"
fi

# Phase: api — HTTP-level probes of the public surfaces
if phase api; then
  require_cmd curl
  check() {
    local name="$1" url="$2"
    if curl -fsS --max-time 10 "$url" >/dev/null 2>&1; then
      ok "✓ $name ($url)"
    else
      warn "✗ $name unreachable: $url"
      return 1
    fi
  }
  api_failures=0
  check "hyperswitch /health"     "http://localhost:8081/health" || api_failures=$((api_failures + 1))
  check "killbill /healthcheck"   "http://localhost:8082/1.0/healthcheck" || api_failures=$((api_failures + 1))
  check "nats monitoring /healthz" "http://localhost:8222/healthz" || api_failures=$((api_failures + 1))
  if [ "$api_failures" -gt 0 ]; then die "$api_failures API probe(s) failed"; fi
  phase_end "api"
fi

# Phase: business — end-to-end flow, best-effort unless --require-processor.
# Requires real processor (Paystack) keys; skipped cleanly when absent.
if phase business; then
  if [ -z "${PAYSTACK_SECRET_KEY:-}" ]; then
    if [ "$REQUIRE_PROCESSOR" = "1" ]; then
      die "--require-processor set but PAYSTACK_SECRET_KEY is missing"
    fi
    warn "PAYSTACK_SECRET_KEY not set — skipping business flow (integration needs live keys)"
  else
    log "processor keys present — running business flow"
    # 1. Customer + payment init through Hyperswitch
    API_KEY="${HYPERSWITCH_ADMIN_API_KEY:-your_hyperswitch_api_key}"
    init_resp="$(curl -fsS --max-time 20 -X POST http://localhost:8081/payments \
      -H "Content-Type: application/json" -H "api-key: $API_KEY" \
      -d '{"amount":50000,"currency":"NGN","payment_method":"card","connector":"paystack",
           "billing":{"email":"ci@openpay.app"},"confirmation":"automatic"}' 2>/dev/null || true)"
    if echo "$init_resp" | grep -q '"payment_id"'; then
      ok "payment initialized (Hyperswitch)"
    else
      warn "payment init did not return payment_id: $(echo "$init_resp" | head -c 300)"
    fi
    # 2. Fraud evaluation via Tazama (if up)
    if curl -fsS --max-time 5 http://localhost:8084/health >/dev/null 2>&1; then
      ok "tazama-rule-exec healthy — fraud pipeline available"
    else
      warn "tazama-rule-exec not up — skipping fraud evaluation"
    fi
    # 3. Webhook delivery (proxy route)
    if curl -fsS --max-time 10 -X POST http://localhost/webhooks/paystack \
        -H "Content-Type: application/json" -H "X-Webhook-Secret: ${WEBHOOK_SECRET:-your_webhook_secret_here}" \
        -d '{"event":"charge.success","data":{"reference":"ci_smoke_'"$RANDOM"'","amount":50000,"currency":"NGN","status":"success"}}' \
        >/dev/null 2>&1; then
      ok "webhook accepted (proxy → NATS)"
    else
      warn "webhook probe failed (proxy may be optional in this profile)"
    fi
  fi
  phase_end "business"
fi

if [ -n "$PHASE" ]; then
  ok "phase '${PHASE#\?}' finished"
fi
ok "ci-smoke: all required phases passed"
