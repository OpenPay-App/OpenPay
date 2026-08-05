# Changelog

All notable changes to OpenPay will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - Public Beta Release Preparation (2026-08-05)

### All Phases Completed

- ✅ Phase 0: Security & PCI Compliance Hardening
- ✅ Phase 1: Git Hygiene & Secrets Rotation
- ✅ Phase 2: Environment Isolation & Docker Profiles
- ✅ Phase 3: API Key & Checkout Hardening
- ✅ Phase 4: Reddit Pain Points Features
- ✅ Phase 5: Marketing & Positioning
- ✅ Phase 6: Final QA & Public Beta Launch

### 🔒 Phase 0: Security & PCI Compliance Hardening

#### Fixed
- **PCI Compliance**: Checkout page now uses Hyperswitch Elements (secure iframes) instead of raw card input fields
- **Hardcoded Secrets**: Replaced all hardcoded secrets in `docker_compose.toml` with environment variable references
- **MASTER_ENC_KEY**: Removed hardcoded encryption key from `docker-compose.yml`, now uses `${MASTER_ENC_KEY}`
- **Traefik Dashboard**: Disabled `insecure: true` and added Basic Auth middleware for dashboard protection
- **CORS Configuration**: Changed `wildcard_origin = true` to explicit domain allowances
- **CSP Headers**: Added Content-Security-Policy headers to Traefik for XSS protection

#### Security
- All database passwords now use `${POSTGRES_PASSWORD}` references
- Redis password now uses `${REDIS_PASSWORD}` reference
- JWT secret now uses `${HYPERSWITCH_JWT_SECRET}` reference
- Admin API key now uses `${HYPERSWITCH_ADMIN_API_KEY}` reference
- Email SMTP credentials now use environment variable references

### 🧹 Phase 1: Git Hygiene & Secrets Rotation

#### Added
- Security patterns to `.gitignore`: `*.pem`, `*.key`, `*.cert`, `acme.json`, `*.sqlite`
- `scripts/generate-secrets.sh` for generating cryptographically secure random values
- `scripts/generate-dashboard-auth.sh` for generating Traefik Basic Auth hashes

#### Changed
- All credentials rotated with new secure random values
- `.env.example` updated with documentation for all required variables

#### Verified
- No `.env` files are tracked in version control (only `.env.example`)
- Git history scan found no leaked API keys or private keys
- Old database URL with password found in git history (cannot be removed without history rewrite)

### 🐳 Phase 2: Environment Isolation & Docker Profiles

#### Added
- Docker Compose profiles: `core`, `monitoring`, `full`
- `scripts/validate-env.sh` for environment configuration validation
- Makefile targets: `up-core`, `up-monitoring`, `up-full`, `down-core`, `down-full`

#### Changed
- `make init` now creates all `.env` files from templates
- `make init-secrets` generates secure production values
- `make init-full` runs both init and secrets generation

### 🔑 Phase 3: API Key & Checkout Hardening

#### Added
- Rate limiting configuration for Traefik API routes
- Refund guide documentation with step-by-step instructions
- Troubleshooting section for common refund issues

#### Verified
- Checkout route already has environment-aware mode detection
- API key prefix logic centralized in constants.ts
- Sandbox/production mode isolation working correctly

### 📋 Phase 4: Reddit Pain Points Features

#### Added
- Supported Processors Guide with 100+ processors documentation
- High-Risk Merchant Guide for high-risk industries
- KYC & Compliance Guide for regulatory requirements
- International Payments Guide with regional support
- Refund Guide with step-by-step instructions
- Guides Index Page for easy navigation

#### Documentation
- Processor switching step-by-step instructions
- High-risk category listings and processor compatibility
- Compliance checklists for merchants and developers
- Regional payment method and processor recommendations
- GDPR guidelines reference updated to gdpr-info.eu

### 📣 Phase 5: Marketing & Positioning

#### Added
- "Why Developers Leave Stripe" landing page with Reddit pain points
- Hero tagline updated: "No one can freeze your money. Ever."
- "No TOS to Violate" feature added to features section
- "High-Risk? No Problem" feature added to features section
- "Account Control" comparison group in pricing section
- Footer navigation updated with "Why OpenPay?" link
- Security page updated with self-hosted advantage messaging

### ✨ Phase 6: Final Polish & Release

#### Fixed
- GitHub URLs verified and pointing to correct organization
- Terms page date updated to August 5, 2026
- 404 error page enhanced with helpful navigation links
- Build errors fixed: added "use client" and dynamic exports to interactive pages

#### Verified
- All documentation accurate and up-to-date
- pnpm build succeeds with no errors
- No TypeScript errors
- No ESLint warnings

### 📝 Documentation

#### Added
- `docs/PHASE-0-SECURITY-HARDENING.md` - Security hardening guide
- `docs/PHASE-1-GIT-HYGIENE.md` - Git hygiene and secrets rotation
- `docs/PHASE-2-ENVIRONMENT-ISOLATION.md` - Environment isolation guide
- `docs/PHASE-3-API-CHECKOUT-HARDENING.md` - API and checkout hardening
- `docs/PHASE-4-REDDIT-FEATURES.md` - Reddit pain points features
- `docs/PHASE-5-MARKETING-POSITIONING.md` - Marketing and positioning
- `docs/PHASE-6-POLISH-RELEASE.md` - Final polish and release

---

## Previous Releases

### [1.0.0-beta.1] - 2026-07-15

#### Added
- Initial public beta release
- Hyperswitch payment orchestration integration
- Kill Bill subscription billing
- Tazama fraud detection
- NATS JetStream event bus
- Merchant dashboard with Next.js
- Docker Compose deployment

#### Features
- Multi-processor support (Stripe, Paystack, Adyen, 100+)
- Sandbox and production modes
- Webhook signature verification
- Real-time fraud detection
- Subscription management
- Invoice generation

---

## Security Notes

### Critical Security Fixes (Phase 0)

1. **PCI Compliance**: Raw card data is no longer collected in the checkout page
2. **Secret Management**: All secrets now use environment variable references
3. **Dashboard Protection**: Traefik dashboard requires authentication
4. **CORS Security**: Cross-origin requests restricted to allowed domains
5. **CSP Headers**: Content-Security-Policy protects against XSS attacks

### Credentials Rotation (Phase 1)

All credentials have been rotated with cryptographically secure random values:
- Database passwords (32+ characters)
- Redis passwords (32+ characters)
- JWT secrets (base64 encoded)
- Master encryption keys (64 hex characters)
- Grafana admin passwords (32 characters)
- Kill Bill API secrets (32 characters)

### Environment Isolation (Phase 2)

Docker Compose profiles enable flexible deployment:
- `core` - Essential payment processing services
- `monitoring` - Add Prometheus, Grafana, Loki
- `full` - Everything including dev tools

---

## Upgrade Instructions

### From Pre-Security-Hardening

1. Backup your existing `.env` files
2. Run `make init` to create new `.env` files from templates
3. Run `make init-secrets` to generate secure values
4. Update your Paystack and Kinde credentials in `.env`
5. Restart services with `docker compose --profile core up -d`

### Important Notes

- **Never commit `.env` files** to version control
- **Rotate credentials** if you suspect any exposure
- **Use strong passwords** (32+ characters) for all secrets
- **Enable HTTPS** in production with valid TLS certificates
