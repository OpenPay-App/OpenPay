# OpenPay — Development Handoff

> **Date:** July 31, 2026
> **Branch:** `main`
> **Deployed:** Vercel (`apps/merchant-dashboard` → Root dir)

---

## 🚀 Vercel Deployment (Phase 0 — Fixed)

### Problem
3 TypeScript errors blocked the Vercel build:
1. **Middleware** — `withAuth()` from Kinde had an ambiguous return type when dynamically imported (`Promise<NextResponse> | handler function`).
2. **Checkout page** — Dead `status === "loading"` check after TypeScript narrowed the union type.
3. **Open source section** — `useScrollReveal()` defaulted to `HTMLDivElement` ref but was attached to a `<Link>` (anchor element).

### Fixes
1. `middleware.ts` — Added type assertion: `as (request: NextRequest) => Promise<NextResponse>`
2. `checkout/[session]/page.tsx` — Removed unreachable `{status === "loading" && ...}` block
3. `open-source.tsx` — Changed to `useScrollReveal<HTMLAnchorElement>({...})`

### Vercel Settings
- **Root Directory:** `apps/merchant-dashboard`
- **Env vars:** None needed (Kinde auth skipped when env vars not set)
- **Next.js version:** 15.3.3 (vulnerability warning — update with `pnpm add next@latest`)

---

## 📚 Documentation Overhaul (Phase 1)

### Pages Created/Enhanced
| Page | What |
|------|------|
| `/docs` | About OpenPay — mission, story, tech stack |
| `/docs/security` | Key management, encryption, PCI compliance |
| `/docs/self-hosting/troubleshooting` | 15+ issues across 6 categories |
| `/docs/contributing` | 6-step contributor workflow |
| `/docs/architecture` | ASCII diagrams, event flow, service matrix |
| `/license` | Logo + MIT text + info cards |

### Components Created
- **`CodeBlock`** — Reusable code display with copy button, language label, and Mac traffic lights
- Integrated into 8 docs pages

### Other Files
- **`CODE_OF_CONDUCT.md`** — Contributor Covenant v2.1
- **`LICENSE`** — MIT (already existed)
- **`README.md`** — Redesigned with centered logo, badges, file listing table, quick start, architecture table

### URL Fixes
- Kill Bill: `killbill.io/docs` → `docs.killbill.io`
- Tazama: `tazama-labs` → `tazama-lf`
- GitHub: `OpenPay-App/OpenPay` → `OpenPay-App/openpay`
- lucide-react: `Docker` → `Container`

---

## 🏗️ Phase 2 — Environment & Profiles

### Consolidated `.env.example`
Master template at project root with all service env vars organized by category:
- Provider-agnostic naming (`PROCESSOR_*` instead of `PAYSTACK_*`)
- Includes Kinde auth vars (leave blank to skip auth)

### `make init` Command
One-command setup: copies all `.env.example` → `.env` for every service:
```bash
cp .env.example .env
make init
```

### Docker Compose Profiles
| Profile | Command | Services |
|---------|---------|----------|
| **core** | `docker compose --profile core up -d` | postgres, redis, nats, hyperswitch, killbill, proxy, etc. |
| **tazama** | add `--profile tazama` | tazama-auth, rule-exec, rule-studio, case-management |
| **monitoring** | add `--profile monitoring` | prometheus, grafana, loki, promtail |
| **full** | `docker compose --profile full up -d` | Everything |

> ⚠️ Always include core: `docker compose --profile core --profile tazama up -d`

---

## 🎛️ Hyperswitch Control Center Dashboard Fix

### Problem
`dashboard.toml` and `dashboard_theme.json` were **directories** (not files), causing:
1. **Docker bind mount error:** `not a directory: Are you trying to mount a directory onto a file?`
2. **"Missing config" error** in the Control Center UI at `localhost:9000/accounts`

### Root Cause
The config files were created as directories by a script or manual operation, docker-compose tried to mount them as files, Docker WSL2 gave a cryptic error.

### Fix
1. Deleted the two directories:
   ```powershell
   Remove-Item -Recurse -Force payment-system\hyperswitch\config\dashboard.toml
   Remove-Item -Recurse -Force payment-system\hyperswitch\config\dashboard_theme.json
   ```
2. Created `dashboard.toml` with:
   ```toml
   [config]
   api_url = "http://localhost:8081"
   sdk_url = "http://localhost:8081"

   [features]
   test_processors = true
   test_live_toggle = true
   is_live_mode = false
   # ... other feature flags
   ```
3. Created `dashboard_theme.json` with OpenPay orange branding (#FF6B00)
4. Removed and recreated the container:
   ```powershell
   docker compose rm -sf hyperswitch-control-center
   docker compose up -d hyperswitch-control-center
   ```

### YAML Issue During Fix
When adding profiles to docker-compose.yml, the Tazama services got **duplicate `profiles:` keys**, causing:
```
yaml: mapping key "profiles" already defined at line 242
```
Fix: Removed the duplicate `profiles` block from each Tazama service.

---

## 📧 Phase 3 — Email Delivery & Third-Party Tools Docs

### Email Delivery Made Provider-Agnostic
- **`docker-compose.yml`** — added `ROUTER__EMAIL__*` + `ROUTER__USER__BASE_URL` passthrough to the `hyperswitch` service (pulled from root `.env` `EMAIL_*` vars with MailHog dev defaults). Added `default__features__email` / `default__config__api_url` / `default__config__sdk_url` overrides to the Control Center container.
- **`payment-system/hyperswitch/config/docker_compose.toml`** — added a dev-default `[email]` + `[email.smtp]` block (host `mailhog`, port 1025, plaintext) that every deployer overrides via `ROUTER__EMAIL__*` env vars. No codebase edits needed to use Resend/SES/Postmark/Brevo/SendGrid.
- **`.env.example`** (root + hyperswitch) — documented the full email block: `EMAIL_ACTIVE_CLIENT`, `EMAIL_SENDER_EMAIL`, `EMAIL_SMTP_HOST/PORT/CONNECTION/TIMEOUT/USERNAME/PASSWORD`, `HYPERSWITCH_DASHBOARD_URL`, `HYPERSWITCH_PUBLIC_API_URL`, `HYPER_EMAIL_ENABLED`.
- **MailHog service** added to compose (`--profile dev`), web UI at `http://localhost:8025` — local email testing without any provider.
- **Key gotcha documented:** `HYPERSWITCH_DASHBOARD_URL` must be the public URL, not `localhost`, or every email link is dead → “Invalid Link or session expired”.

### Monitoring Stack Scaffold (was broken)
- `monitoring/prometheus/prometheus.yml`, `monitoring/grafana/datasources/prometheus.yml`, `monitoring/grafana/dashboards/dashboards.yml`, `monitoring/grafana/dashboards/dashboards/overview.json`, `monitoring/loki/loki.yml`, `monitoring/promtail/config.yml` — all created (dirs were empty, so `--profile monitoring` crashed).
- Added `/var/run/docker.sock` mount to `promtail` for container-log discovery.

### Docs Pages Added (merchant-dashboard)
- `/docs/self-hosting/tools` — Third-Party Tools matrix (Grafana, Prometheus, Loki, Hyperswitch, Kill Bill, Tazama, NATS, Traefik) with access URLs, credentials, official docs links.
- `/docs/self-hosting/monitoring` — Grafana dashboards: bundled dashboard, file formats (JSON), 3 ways to create/import dashboards, Grafana template gallery, Loki log queries.
- `/docs/self-hosting/email-delivery` — SMTP provider matrix, domain verification, env config, team invite walkthrough, auth methods, full env reference.
- Sidebar updated; env-vars reference page extended (email + monitoring vars).

---

## ✅ Services Currently Running

After `docker compose up -d` (all healthy):
- `core-proxy` — Traefik reverse proxy (port 80, 443, 8080)
- `core-postgres` — PostgreSQL 15 (port 5432)
- `core-redis` — Redis 7 (port 6379)
- `core-nats` — NATS JetStream (ports 4222, 8222)
- `core-mock-superposition` — Local config service (port 9999)
- `core-hyperswitch` — Payment router (port 8081)
- `core-hyperswitch-dashboard` — Control Center UI (port 9000)
- `core-killbill` — Subscription billing (port 8082)
- `core-nats-kb-bridge` — NATS ↔ Kill Bill bridge

---

## 📝 Remaining To-Dos

- [ ] Update Next.js: `pnpm add next@latest` (security patch)
- [ ] Phase 3: Sandbox/Production dual-mode alignment
- [ ] Phase 4: Multi-provider routing verification
- [ ] Phase 5: Growth & Polish (branding, positioning)
- [ ] Phase 6: Repository migration (GitHub org update)

---

## 🔐 Hyperswitch Self-Hosted Signup — Fixed (Phase 4)

> **Date:** August 1, 2026
> **Result:** Signup works end-to-end. Verified user in DB (`is_verified = t`).
> Full error-by-error writeup: [`docs/HYPERSWITCH_SIGNUP_TROUBLESHOOTING.md`](./HYPERSWITCH_SIGNUP_TROUBLESHOOTING.md)

### Root Cause of the Whole Saga
`docker-compose.yml` set `RUN_ENV: docker_compose`. `RUN_ENV` is parsed with
`router_env::Env` (`development | integ | sandbox | production`), so the invalid value
silently fell back to **`production`** — and `connect_account`
(`crates/router/src/core/user.rs:296`) deliberately rejects **new-user signups** in a
production env with `UR_01 "Incorrect email or password"`. Existing users could still
sign in, which made it look like an auth bug rather than an env bug.

### Fix
```yaml
# hyperswitch service, environment: block
RUN_ENV: development
```
```powershell
docker compose --profile core up -d --force-recreate hyperswitch
```

### Verified
- `printenv RUN_ENV` → `development`; router logs carry `"env":"development"`.
- `POST /user/connect_account` → `200 {"is_email_sent":true}`.
- Magic link lands in MailHog (`localhost:8025`) and the browser journey completes
  (signup → magic link → TOTP setup → Control Center). Confirmed in PostgreSQL:
  ```sql
  select email, is_verified from users order by created_at desc;
  -- levarlux@proton.me | t
  ```

### What We Learned (short version)
- `ROUTER__USER__RECON_SIGNUP_ALLOWED` / `OPEN_SIGNUP_ALLOWED` **do not exist** in
  `v1.125.0` — don't rely on them.
- `HYPERSWITCH_ENVIRONMENT` in `payment-system/hyperswitch/.env` is **not read** by the
  router; only `RUN_ENV` controls the env.
- For a **new** user, the magic link maps to **TOTP setup** (`from_email` → token_type
  `totp`), not the `v2/verify_email` route. `v2/verify_email` is only for
  already-verified users.
- TOTP routes: `GET /user/2fa/totp/begin` (setup secret) → **`PUT`**
  `/user/2fa/totp/verify` with `{"totp":"<code>"}` for setup (`POST` is login-time
  verification and returns `UR_36` for new users). The setup handler only accepts the
  current 30-second window's code (`UR_37` otherwise).
- MailHog bodies are quoted-printable; strip `=\r?\n` and decode `=3D` before regexing
  the `token=...` out. In this version the link lives in the **"Welcome to the
  community!"** email.

