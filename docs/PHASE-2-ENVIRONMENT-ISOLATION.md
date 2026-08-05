# Phase 2: Environment Isolation & Docker Profiles

**Status**: ⚠️ PARTIALLY DONE  
**Priority**: 🟡 IMPORTANT  
**Estimated Duration**: Days 4-5  
**Goal**: Centralize configuration management and simplify environment startup with Docker Compose profiles.

---

## Executive Summary

Phase 2 establishes clean separation between different deployment modes (core payment services, monitoring, full stack) using Docker Compose profiles. This enables developers to run only the services they need, reducing resource consumption and complexity during development.

---

## Task Breakdown

### 2.1 Centralized Secret Management 🟡 IMPORTANT

**Goal**: Consolidate all environment configuration into a central `.env.example` file with clear documentation.

| # | Task | Status | Effort |
|---|------|--------|--------|
| 1 | Audit all .env.example files | ✅ DONE | 30m |
| 2 | Create master .env.example with all variables | ✅ DONE | 1h |
| 3 | Document variable dependencies | ✅ DONE | 30m |
| 4 | Add validation script | ✅ DONE | 30m |

**Current State**:

Scattered `.env.example` files:
```
.env.example                              # Root
event-bus/.env.example                    # NATS
payment-system/hyperswitch/.env.example   # Hyperswitch
payment-system/killbill/.env.example      # Kill Bill
payment-system/nats-kb-bridge/.env.example # NATS-KB Bridge
monitoring-and-rules/.env.example         # Monitoring
apps/merchant-dashboard/.env.local.example # Dashboard
```

**Target State**:

Single comprehensive `.env.example` with clear sections and documentation:

```bash
# =============================================================================
# OpenPay Configuration
# =============================================================================
# Copy this file to .env and fill in the values
# cp .env.example .env
#
# NEVER commit .env files to version control!
# =============================================================================

# ─── Database ────────────────────────────────────────────────────────────────
POSTGRES_PASSWORD=                    # Required: Strong password for PostgreSQL
POSTGRES_USER=postgres                # Default: postgres
POSTGRES_DB=openpay                   # Default: openpay

# ─── Redis ───────────────────────────────────────────────────────────────────
REDIS_PASSWORD=                       # Required: Strong password for Redis

# ─── Hyperswitch ─────────────────────────────────────────────────────────────
HYPERSWITCH_JWT_SECRET=               # Required: JWT secret for Hyperswitch
MASTER_ENC_KEY=                       # Required: Master encryption key (64 hex chars)
HYPERSWITCH_ADMIN_API_KEY=            # Required: Admin API key for Hyperswitch

# ─── Payment Processor (Paystack) ───────────────────────────────────────────
PAYSTACK_SECRET_KEY=                  # Required: sk_test_xxxxx or sk_live_xxxxx
PAYSTACK_PUBLIC_KEY=                  # Required: pk_test_xxxxx or pk_live_xxxxx
PAYSTACK_WEBHOOK_SECRET=              # Required: Webhook signing secret

# ─── Authentication (Kinde) ─────────────────────────────────────────────────
KINDE_CLIENT_ID=                      # Required: Kinde application client ID
KINDE_CLIENT_SECRET=                  # Required: Kinde application client secret
KINDE_ISSUER_URL=                     # Required: Kinde issuer URL
NEXT_PUBLIC_KINDE_CLIENT_ID=          # Required: Public client ID for frontend
NEXT_PUBLIC_KINDE_ISSUER_URL=         # Required: Public issuer URL for frontend

# ─── Email (SMTP) ───────────────────────────────────────────────────────────
EMAIL_SMTP_HOST=mailhog               # Default: mailhog (local)
EMAIL_SMTP_PORT=1025                  # Default: 1025
EMAIL_SMTP_USERNAME=                  # Optional: SMTP username
EMAIL_SMTP_PASSWORD=mailhog           # Default: mailhog (local)
EMAIL_SENDER=noreply@openpay.dev      # Default: noreply@openpay.dev

# ─── Monitoring ──────────────────────────────────────────────────────────────
GRAFANA_ADMIN_PASSWORD=admin          # Default: admin (CHANGE FOR PRODUCTION!)

# ─── Kill Bill ───────────────────────────────────────────────────────────────
KILLBILL_API_KEY=admin                # Default: admin
KILLBILL_API_SECRET=                  # Required: Kill Bill API secret
KILLBILL_DEFAULT_PASSWORD=admin       # Default: admin (CHANGE FOR PRODUCTION!)

# ─── Dashboard ───────────────────────────────────────────────────────────────
NEXT_PUBLIC_OPENPAY_MODE=sandbox      # Default: sandbox (sandbox|production)
NEXT_PUBLIC_HYPERSWITCH_PUBLISHABLE_KEY=  # Required: Publishable API key
```

**Implementation Steps**:

1. **Audit existing .env.example files**:
   ```bash
   # List all variables across all .env.example files
   for f in $(find . -name "*.env.example" -o -name ".env.example"); do
     echo "=== $f ==="
     grep -E "^[A-Z_]+=" "$f" | head -20
     echo ""
   done
   ```

2. **Create master .env.example**:
   ```bash
   # Create comprehensive .env.example
   cat > .env.example << 'EOF'
   # [Full content from above]
   EOF
   ```

3. **Create validation script**:
   ```bash
   cat > scripts/validate-env.sh << 'EOF'
   #!/bin/bash
   set -e
   
   echo "🔍 Validating environment configuration..."
   
   REQUIRED_VARS=(
     "POSTGRES_PASSWORD"
     "REDIS_PASSWORD"
     "HYPERSWITCH_JWT_SECRET"
     "MASTER_ENC_KEY"
     "PAYSTACK_SECRET_KEY"
     "PAYSTACK_WEBHOOK_SECRET"
     "KINDE_CLIENT_ID"
     "KINDE_CLIENT_SECRET"
   )
   
   MISSING=0
   for var in "${REQUIRED_VARS[@]}"; do
     if [ -z "${!var}" ]; then
       echo "❌ Missing required variable: $var"
       MISSING=1
     else
       echo "✅ $var is set"
     fi
   done
   
   if [ $MISSING -eq 1 ]; then
     echo ""
     echo "❌ Validation failed. Please set missing variables in .env"
     exit 1
   fi
   
   echo ""
   echo "✅ All required variables are set"
   EOF
   
   chmod +x scripts/validate-env.sh
   ```

**Validation**:
```bash
# Test validation script
source .env
./scripts/validate-env.sh
```

---

### 2.2 Docker Compose Profiles 🟡 IMPORTANT

**Goal**: Configure `core`, `monitoring`, and `full` profiles for flexible deployment.

| # | Task | Status | Effort |
|---|------|--------|--------|
| 1 | Add profile labels to all services | ✅ DONE | 2-3h |
| 2 | Test core-only mode | ✅ DONE | 30m |
| 3 | Test full mode | ✅ DONE | 30m |
| 4 | Update documentation | ✅ DONE | 30m |

**Current State**:

```yaml
# docker-compose.yml - CURRENT
# No profiles configured, all services start together
services:
  postgres:
    # ...
  redis:
    # ...
  nats:
    # ...
  hyperswitch:
    # ...
  # All services run together
```

**Target State**:

```yaml
# docker-compose.yml - TARGET with profiles
services:
  # ─── Core Data Layer ──────────────────────────────────────────────────────
  postgres:
    profiles: ["core", "monitoring", "full"]
    # ...
  
  redis:
    profiles: ["core", "monitoring", "full"]
    # ...
  
  nats:
    profiles: ["core", "monitoring", "full"]
    # ...
  
  # ─── Core Payment Services ────────────────────────────────────────────────
  hyperswitch:
    profiles: ["core", "full"]
    # ...
  
  killbill:
    profiles: ["core", "full"]
    # ...
  
  nats-kb-bridge:
    profiles: ["core", "full"]
    # ...
  
  merchant-dashboard:
    profiles: ["core", "full"]
    # ...
  
  # ─── Fraud Detection ──────────────────────────────────────────────────────
  tazama-auth:
    profiles: ["core", "full"]
    # ...
  
  tazama-rule-exec:
    profiles: ["core", "full"]
    # ...
  
  tazama-rule-studio:
    profiles: ["core", "full"]
    # ...
  
  case-management:
    profiles: ["core", "full"]
    # ...
  
  # ─── Monitoring Stack ─────────────────────────────────────────────────────
  traefik:
    profiles: ["core", "monitoring", "full"]
    # ...
  
  prometheus:
    profiles: ["monitoring", "full"]
    # ...
  
  grafana:
    profiles: ["monitoring", "full"]
    # ...
  
  loki:
    profiles: ["monitoring", "full"]
    # ...
  
  promtail:
    profiles: ["monitoring", "full"]
    # ...
  
  # ─── Development Tools ────────────────────────────────────────────────────
  mailhog:
    profiles: ["full"]
    # ...

# ─── Profile Definitions ────────────────────────────────────────────────────
# core    → Essential payment processing (POST, Redis, NATS, Hyperswitch, Kill Bill, Dashboard)
# monitoring → Add Prometheus, Grafana, Loki for observability
# full    → Everything including dev tools (MailHog, Tazama Rule Studio)
```

**Implementation Steps**:

1. **Add profiles to docker-compose.yml**:
   ```yaml
   services:
     postgres:
       image: postgres:15
       profiles: ["core", "monitoring", "full"]
       # ... rest of config
     
     redis:
       image: redis:7-alpine
       profiles: ["core", "monitoring", "full"]
       # ... rest of config
     
     # Continue for all services...
   ```

2. **Test core-only mode**:
   ```bash
   # Start only core payment services
   docker compose --profile core up -d
   
   # Verify only core services are running
   docker compose ps
   
   # Expected output:
   # NAME                    STATUS
   # openpay-postgres-1      running
   # openpay-redis-1         running
   # openpay-nats-1          running
   # openpay-hyperswitch-1   running
   # openpay-killbill-1      running
   # openpay-dashboard-1     running
   ```

3. **Test monitoring mode**:
   ```bash
   # Start core + monitoring
   docker compose --profile monitoring up -d
   
   # Verify monitoring services added
   docker compose ps | grep -E "prometheus|grafana|loki"
   ```

4. **Test full mode**:
   ```bash
   # Start everything
   docker compose --profile full up -d
   
   # Verify all services running
   docker compose ps | wc -l
   # Should show 15+ services
   ```

5. **Update Makefile**:
   ```makefile
   # Add profile targets
   .PHONY: up-core up-monitoring up-full
   
   up-core:
   	docker compose --profile core up -d
   	@echo "✅ Core payment services started"
   
   up-monitoring:
   	docker compose --profile monitoring up -d
   	@echo "✅ Core + monitoring services started"
   
   up-full:
   	docker compose --profile full up -d
   	@echo "✅ All services started"
   ```

**Validation**:
```bash
# Test core-only
make up-core
docker compose ps --format "table {{.Name}}\t{{.Status}}" | grep -v "monitoring\|grafana\|prometheus"
# Should show only core services

# Cleanup
docker compose --profile core down

# Test full
make up-full
docker compose ps --format "table {{.Name}}\t{{.Status}}" | wc -l
# Should show 15+ services
```

---

### 2.3 Remove All Hardcoded Passwords from TOML Files 🟡 IMPORTANT

**Goal**: Ensure all TOML configuration files use environment variable references.

| # | Task | Status | Effort |
|---|------|--------|--------|
| 1 | Audit TOML files for hardcoded values | ✅ DONE | 30m |
| 2 | Replace with ${ENV} references | ✅ DONE | 1h |
| 3 | Test configuration loads correctly | ✅ DONE | 30m |

**Current State (Issues)**:

```toml
# payment-system/hyperswitch/config/docker_compose.toml - CURRENT
[redis]
password = "R3d!sS3cur3#2026"  # Line 27, 35

[secrets]
jwt_secret = "secret"  # Line 43
master_enc_key = "73ad7bbbbc640c845a150f67d058b279849370cd2c1f3c67c4dd6c869213e13a"  # Line 44

[email.smtp]
password = "mailhog"  # Line 114

# payment-system/hyperswitch/config/config.toml - CURRENT
[database]
password = "localdev123"  # Line 14, 26, 38
```

**Target State**:

```toml
# payment-system/hyperswitch/config/docker_compose.toml - TARGET
[redis]
password = "${REDIS_PASSWORD}"

[secrets]
jwt_secret = "${HYPERSWITCH_JWT_SECRET}"
master_enc_key = "${MASTER_ENC_KEY}"

[email.smtp]
password = "${EMAIL_SMTP_PASSWORD}"

# payment-system/hyperswitch/config/config.toml - TARGET
[database]
password = "${POSTGRES_PASSWORD}"
```

**Implementation Steps**:

1. **Find all hardcoded values**:
   ```bash
   # Find hardcoded passwords in TOML files
   grep -rn "password.*=.*\"" payment-system/hyperswitch/config/*.toml
   
   # Find hardcoded secrets
   grep -rn "secret.*=.*\"" payment-system/hyperswitch/config/*.toml
   ```

2. **Replace with environment variables**:
   ```bash
   # Use sed to replace (be careful with escaping)
   sed -i 's/password = "R3d!sS3cur3#2026"/password = "${REDIS_PASSWORD}"/g' \
     payment-system/hyperswitch/config/docker_compose.toml
   
   sed -i 's/jwt_secret = "secret"/jwt_secret = "${HYPERSWITCH_JWT_SECRET}"/g' \
     payment-system/hyperswitch/config/docker_compose.toml
   
   # Repeat for all files...
   ```

3. **Test configuration**:
   ```bash
   # Verify TOML files parse correctly
   docker compose config
   
   # Start services and check logs
   docker compose up -d hyperswitch
   docker compose logs hyperswitch | head -50
   ```

**Validation**:
```bash
# Verify no hardcoded passwords remain
grep -rn "password.*=.*\"" payment-system/hyperswitch/config/*.toml
# Should return no results

# Verify environment variables are used
grep -rn "password.*=.*\${" payment-system/hyperswitch/config/*.toml
# Should show all password fields
```

---

### 2.4 Ensure .env.example Templates Are Complete 🟢 NICE TO HAVE

**Goal**: Verify all .env.example files have complete documentation and placeholder values.

| # | Task | Status | Effort |
|---|------|--------|--------|
| 1 | Review each .env.example | ✅ DONE | 30m |
| 2 | Add missing variables | ✅ DONE | 30m |
| 3 | Add inline documentation | ✅ DONE | 30m |

**Checklist for Each .env.example**:

- [ ] All required variables listed
- [ ] Default values provided where applicable
- [ ] Comments explain each variable
- [ ] Examples show expected format (e.g., `sk_test_xxxxx`)
- [ ] Security notes (e.g., "CHANGE FOR PRODUCTION!")

**Example Template**:

```bash
# payment-system/hyperswitch/.env.example

# =============================================================================
# Hyperswitch Configuration
# =============================================================================

# ─── Database ────────────────────────────────────────────────────────────────
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=hyperswitch
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=                    # Required: Must match root .env POSTGRES_PASSWORD

# ─── Redis ───────────────────────────────────────────────────────────────────
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=                       # Required: Must match root .env REDIS_PASSWORD

# ─── API Keys ────────────────────────────────────────────────────────────────
HYPERSWITCH_API_KEY=                  # Required: Admin API key (generate with: openssl rand -hex 32)

# ─── Server ──────────────────────────────────────────────────────────────────
SERVER_PORT=8081
SERVER_HOST=0.0.0.0

# ─── Logging ─────────────────────────────────────────────────────────────────
LOG_LEVEL=info                        # Default: info (debug|info|warn|error)
```

---

## Validation Checklist

Before marking Phase 2 as complete, verify:

- [x] Master `.env.example` exists with all variables documented
- [x] All service `.env.example` files are complete
- [x] Docker Compose profiles work correctly
- [x] `docker compose --profile core up -d` starts only core services
- [x] `docker compose --profile full up -d` starts all services
- [x] No hardcoded passwords in TOML files
- [x] All TOML files use `${ENV_VAR}` references
- [x] `make init` creates all .env files
- [x] `./scripts/validate-env.sh` passes

---

## Usage Examples

### Development (Core Only)
```bash
# Start only essential services
make up-core

# Or
docker compose --profile core up -d

# Services: postgres, redis, nats, hyperswitch, killbill, dashboard
```

### Development with Monitoring
```bash
# Add observability stack
make up-monitoring

# Or
docker compose --profile monitoring up -d

# Services: core + prometheus, grafana, loki, promtail
```

### Full Stack (Including Dev Tools)
```bash
# Start everything
make up-full

# Or
docker compose --profile full up -d

# Services: all services including mailhog, tazama rule studio
```

### Production
```bash
# Use core profile with production .env
cp .env.example .env
# Edit .env with production values
docker compose --profile core up -d

# Add monitoring for production
docker compose --profile monitoring up -d
```

---

## Next Steps

After completing Phase 2:
1. Verify all services start correctly with profiles
2. Test environment isolation between sandbox and production
3. Proceed to Phase 3: API Key & Checkout Hardening

---

## References

- [Docker Compose Profiles](https://docs.docker.com/compose/profiles/)
- [Environment Variable Interpolation](https://docs.docker.com/compose/environment-variables/)
- [Docker Compose Configuration](https://docs.docker.com/compose/compose-file/)
