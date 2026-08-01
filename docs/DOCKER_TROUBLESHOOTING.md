# Docker Compose Troubleshooting Guide

> A log of every issue hit while bringing the `core-financial-platform` stack up for the first time, what caused it, and exactly how it was fixed. Kept in chronological order so future devs can Ctrl-F their error message.

---

## Table of Contents

| # | Service | Symptom | Root Cause | Jump |
|---|---------|---------|------------|------|
| 1 | `nats` | Container unhealthy | Broken `--signal ldm` healthcheck | [→](#1-nats-healthcheck-broken---signal-ldm) |
| 2 | `tazama-auth` | Container unhealthy | `curl` not installed in Alpine image | [→](#2-tazama-auth-healthcheck-curl-not-found) |
| 3 | `killbill` | Container crash loop | KPM Ruby `CGI` NameError on startup | [→](#3-killbill-kpm-crash-on-startup-cgi-nameerror) |
| 4 | `killbill` | Container unhealthy | Wrong healthcheck URL (`/isAlive` → 404) | [→](#4-killbill-healthcheck-wrong-endpoint) |
| 5 | `tazama-rule-exec` | Container unhealthy | `curl` not installed in Alpine image | [→](#5-tazama-rule-exec-healthcheck-curl-not-found) |
| 6 | `hyperswitch` | Startup config validation failure | Empty database name — wrong env var prefix | [→](#6-hyperswitch-empty-database-name) |
| 7 | `nats-kb-bridge` | NATS connection refused | Authorization Violation — password mismatch | [→](#7-nats-kb-bridge-nats-authorization-violation) |
| 8 | `tazama-rule-studio` | nginx won't start | Typo: `gzip_min` instead of `gzip_min_length` | [→](#8-tazama-rule-studio-bad-nginx-directive) |
| 9 | `case-management` | nginx won't start | Same `gzip_min` typo | [→](#9-case-management-bad-nginx-directive) |
| 10 | `prometheus` / `loki` / `promtail` | Crash on startup | Monitoring config dirs were empty | [→](#10-monitoring-services-crash-empty-config-directories) |
| 11 | `hyperswitch` | No email sent for invites/verification | No `[email]` section in router config | [→](#11-hyperswitch-email-not-sent-missing-email-config) |
| 12 | `hyperswitch-control-center` | Invites fall back to downloading a credentials file | Control Center `email` feature flag off | [→](#12-control-center-invites-use-credentials-file-fallback) |

---

## 1. NATS Healthcheck Broken — `--signal ldm`

**Symptom**
```
✘ Container core-nats  Error dependency nats failed to start
dependency failed to start: container core-nats is unhealthy
```

**Root Cause**

The original healthcheck used the `nats-server --signal ldm=localhost:8222` command. This doesn't work as a health probe — `ldm` (Lame Duck Mode) is a shutdown signal, not a liveness query. The server was running fine, but Docker kept marking it unhealthy.

**Fix — `docker-compose.yml`**

```diff
  nats:
    healthcheck:
-     test: ["CMD", "nats-server", "--signal", "ldm=localhost:8222"]
+     test: ["CMD", "wget", "-q", "--spider", "http://localhost:8222/healthz"]
```

**Why `wget` and not `curl`?**

The `nats:2.9-alpine` image ships with `wget` (BusyBox) but **not** `curl`. The NATS monitoring endpoint at `/healthz` on port 8222 returns HTTP 200 when the server is ready.

---

## 2. tazama-auth Healthcheck — `curl` Not Found

**Symptom**

```
docker inspect --format='{{json .State.Health}}' core-tazama-auth
# → {"Status":"unhealthy", ...}
# Health log shows: exec: "curl": executable file not found in $PATH
```

**Root Cause**

`tazama-auth` is built on `node:20-alpine`. Alpine images ship with BusyBox `wget` but do **not** include `curl`.

**Fix — `docker-compose.yml`**

```diff
  tazama-auth:
    healthcheck:
-     test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
+     test: ["CMD", "wget", "-q", "--spider", "http://localhost:8080/health"]
```

> [!TIP]
> **General rule for Alpine-based images:** always use `wget -q --spider` instead of `curl -f` in healthchecks unless you've explicitly `apk add curl` in the Dockerfile.

---

## 3. Kill Bill KPM Crash on Startup — `CGI` NameError

**Symptom**

```
docker logs core-killbill --tail 20
# → TASK [Run KPM install] fatal: [localhost]: FAILED!
# → uninitialized constant KPM::NexusFacade::MavenCentralApiCalls::CGI (NameError)
```

**Root Cause**

The `killbill/killbill:latest` image bundles `kpm` gem version 0.12.4, which calls `CGI.escape(...)` without `require 'cgi'`. This worked in older Ruby versions where `cgi` was auto-loaded, but **Ruby 3.1+** (shipped in this image) removed it from the default set. The crash happens when KPM tries to query Maven Central to resolve the "latest" Kill Bill version at container startup.

**Fix — two changes**

### a) Pin the image tag (`docker-compose.yml`)

```diff
  killbill:
-   image: killbill/killbill:latest
+   image: killbill/killbill:0.24.11
```

### b) Pin KPM version via env var (`payment-system/killbill/.env`)

```env
# Pin KPM version to avoid broken Maven Central lookup (CGI NameError in kpm 0.12.4)
KPM_KILLBILL_VERSION=0.24.11
```

This tells KPM exactly which version to install, bypassing the `search_for_artifacts` code path that triggers the Ruby `CGI` bug.

> [!WARNING]
> **Do not switch back to `killbill/killbill:latest`** until the upstream Kill Bill team ships a fixed kpm gem or a new image with Ruby 3.1 compatibility. Track [Kill Bill GitHub Issues](https://github.com/killbill/killbill/issues) for updates.

---

## 4. Kill Bill Healthcheck — Wrong Endpoint

**Symptom**

```
docker inspect --format='{{json .State.Health}}' core-killbill
# → {"Status":"unhealthy", ...}
# curl -f http://localhost:8080/isAlive  →  404
```

**Root Cause**

The original healthcheck pointed to `/isAlive`, which doesn't exist in Kill Bill 0.24.x. The correct health endpoint is `/1.0/healthcheck`.

**Fix — `docker-compose.yml`**

```diff
  killbill:
    healthcheck:
-     test: ["CMD", "curl", "-f", "http://localhost:8080/isAlive"]
+     test: ["CMD", "curl", "-f", "http://localhost:8080/1.0/healthcheck"]
```

> [!NOTE]
> Kill Bill is a JVM app running on Tomcat — it takes significantly longer to boot than the Node/Go services. Don't panic if it stays `starting` for 60–90 seconds. The healthcheck `interval: 30s` with `retries: 3` gives it up to ~90s.

---

## 5. tazama-rule-exec Healthcheck — `curl` Not Found

**Symptom**

Identical to [Issue #2](#2-tazama-auth-healthcheck-curl-not-found) — `curl` binary missing in the Alpine image.

**Fix — `docker-compose.yml`**

```diff
  tazama-rule-exec:
    healthcheck:
-     test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
+     test: ["CMD", "wget", "-q", "--spider", "http://localhost:8080/health"]
```

---

## 6. Hyperswitch — Empty Database Name

**Symptom**

```
Failed to validate router configuration: Invalid configuration value provided: database name must not be empty
```

**Root Cause**

The hyperswitch router binary does **not** read generic env vars like `DATABASE_NAME`. It expects its own prefixed format: `ROUTER__DATABASE__DBNAME`, `ROUTER__DATABASE__HOST`, etc. The `.env` file had the values under the wrong variable names, so the router saw an empty DB name and refused to start.

**Fix — `payment-system/hyperswitch/.env`**

Added the `ROUTER__` prefixed variables that hyperswitch actually reads:

```env
# Hyperswitch router expects ROUTER__DATABASE__ prefixed vars
ROUTER__DATABASE__HOST=postgres
ROUTER__DATABASE__PORT=5432
ROUTER__DATABASE__DBNAME=hyperswitch
ROUTER__DATABASE__USERNAME=coreplatform
ROUTER__DATABASE__PASSWORD=localdev123

# Hyperswitch router expects ROUTER__REDIS__ prefixed vars
ROUTER__REDIS__HOST=redis
ROUTER__REDIS__PORT=6379
```

> [!IMPORTANT]
> The DB username/password must match what's configured in the `postgres` service in `docker-compose.yml` (`POSTGRES_USER: coreplatform`, `POSTGRES_PASSWORD: localdev123`), **not** the generic values that were in the original `.env`.

---

## 7. nats-kb-bridge — NATS Authorization Violation

**Symptom**

```
failed to connect to NATS: nats: Authorization Violation
```

**Root Cause**

Credential mismatch. The `nats-server.conf` defines auth as:

```
authorization {
    user: core-nats-user
    password: your_secure_password_here
}
```

But every `.env` file that connects to NATS had a **different** password (`N@tS_J3tStR3@m!`) and the `NATS_URL` didn't include credentials in the URL itself.

**Fix — all NATS client `.env` files**

Updated `NATS_URL` to embed credentials, and synced `NATS_PASSWORD` across:

- `payment-system/nats-kb-bridge/.env`
- `payment-system/hyperswitch/.env`
- `payment-system/killbill/.env`

```diff
- NATS_URL=nats://nats:4222
- NATS_PASSWORD=N@tS_J3tStR3@m!
+ NATS_URL=nats://core-nats-user:your_secure_password_here@nats:4222
+ NATS_PASSWORD=your_secure_password_here
```

> [!WARNING]
> If you change the password in `nats-server.conf`, you must update **all three** `.env` files above. A single mismatch will cause an `Authorization Violation` at runtime.

---

## 8. tazama-rule-studio — Bad nginx Directive

**Symptom**

```
nginx: [emerg] unknown directive "gzip_min" in /etc/nginx/conf.d/default.conf:16
```

**Root Cause**

Typo in `monitoring-and-rules/tazama-rule-studio/nginx.conf`. The directive `gzip_min` does not exist in nginx — the correct name is `gzip_min_length`.

**Fix — `monitoring-and-rules/tazama-rule-studio/nginx.conf`**

```diff
- gzip_min 1024;
+ gzip_min_length 1024;
```

---

## 9. case-management — Bad nginx Directive

**Symptom**

Identical to [Issue #8](#8-tazama-rule-studio-bad-nginx-directive) — same `gzip_min` typo (both configs were likely copy-pasted from the same template).

**Fix — `monitoring-and-rules/case-management/nginx.conf`**

```diff
- gzip_min 1024;
+ gzip_min_length 1024;
```

---

## 10. Monitoring Services Crash — Empty Config Directories

**Symptom**

```
docker compose --profile monitoring up -d
# → prometheus: Failed to create client: ... could not load configuration
# → loki: failed parsing config: no config file at /etc/loki/loki.yml
# → promtail: failed parsing config: no config file at /etc/promtail/config.yml
```

**Root Cause**

The compose file mounts `./monitoring/prometheus`, `./monitoring/loki`, etc. into the containers, but those directories were created empty — no `prometheus.yml`, `loki.yml`, `promtail/config.yml`, or Grafana provisioning files existed, so each service had no configuration to load.

**Fix — created the missing config files**

```
monitoring/prometheus/prometheus.yml                    # scrape targets (hyperswitch, killbill, self)
monitoring/grafana/datasources/prometheus.yml           # registers Prometheus as Grafana's data source
monitoring/grafana/dashboards/dashboards.yml            # auto-loads dashboards from a folder
monitoring/grafana/dashboards/dashboards/overview.json  # bundled "OpenPay Overview" dashboard
monitoring/loki/loki.yml                                # single-binary filesystem storage
monitoring/promtail/config.yml                          # ships Docker container logs to Loki
```

Also added the Docker socket mount to the `promtail` service so it can discover container logs:

```diff
  promtail:
    volumes:
      - /var/log:/var/log:ro
+     - /var/run/docker.sock:/var/run/docker.sock:ro
```

> [!NOTE]
> Grafana mounts `monitoring/grafana` at `/etc/grafana/provisioning`, so the datasource + dashboard providers are picked up automatically on container start. Add new dashboards by dropping JSON into `monitoring/grafana/dashboards/dashboards/` and restarting Grafana.

---

## 11. Hyperswitch Email Not Sent — Missing `[email]` Config

**Symptom**

Team invites, signup verification, magic links, or password-reset emails never arrive. No `[email]` section exists in `payment-system/hyperswitch/config/docker_compose.toml`, so the router has no email client configured.

**Root Cause**

The router's email client is only initialized when a valid `[email]` block is present. With none, every email operation fails silently server-side — and the Control Center surfaces this as the generic **"Invalid Link or session expired"** page, because the email-link verification token can never be validated.

**Fix — `payment-system/hyperswitch/config/docker_compose.toml`**

Added a dev-default `[email]` block pointing at MailHog; every value is overridable via `ROUTER__EMAIL__*` env vars:

```toml
[email]
sender_email = "no-reply@localhost"
active_email_client = "SMTP"

[email.smtp]
host = "mailhog"
port = 1025
timeout = 10
username = ""
password = ""
connection = "plaintext"
```

For production, set the env vars (they override the file):

```env
# Root .env
EMAIL_SMTP_HOST=smtp.resend.com        # or any provider
EMAIL_SMTP_PORT=587
EMAIL_SMTP_CONNECTION=start_tls
EMAIL_SMTP_USERNAME=re_xxxxxxxx
EMAIL_SMTP_PASSWORD=re_xxxxxxxx
EMAIL_SENDER_EMAIL=no-reply@yourdomain.com
HYPERSWITCH_DASHBOARD_URL=https://dashboard.yourdomain.com
```

> [!NOTE]
> **Verify it starts cleanly:** the SMTP client is lazy (it only connects at send time), so pointing at an unreachable `mailhog` host must not stop the router from booting. Confirm with:
>
> ```
> docker compose --profile core up -d hyperswitch && docker logs core-hyperswitch
> ```
> You should see a healthy `/health` 200 and **no** "Failed to validate router configuration" error.

> [!WARNING]
> **`HYPERSWITCH_DASHBOARD_URL` must be the public URL, not `localhost`.** It is baked into every email link. If it stays `localhost`, teammates clicking the link in their inbox land on an unreachable address → the "Invalid Link or session expired" page.

---

## 12. Control Center Invites Use Credentials-File Fallback

**Symptom**

Admin invites a teammate in the Control Center (Settings → Team → Invite New Users) and instead of an email, the UI downloads an `invited-users.txt` file with generated passwords.

**Root Cause**

The `[features]` section of `payment-system/hyperswitch/config/dashboard.toml` has `email = false`. With email disabled, the Control Center uses the credentials-file invite path. (The dashboard also can't email invites until the router `[email]` config from [Issue #11](#11-hyperswitch-email-not-sent-missing-email-config) is present.)

**Fix**

Set `HYPER_EMAIL_ENABLED=true` in the root `.env` — `docker-compose.yml` passes it to the Control Center container as `default__features__email`, so you never need to edit `dashboard.toml` by hand:

```env
HYPER_EMAIL_ENABLED=true
```

Then recreate the Control Center container:

```
docker compose up -d --force-recreate hyperswitch-control-center
```

> [!NOTE]
> The credentials-file path is a deliberate fallback, not a bug — it lets you onboard teammates with zero email infrastructure. With `email = true` + a working SMTP provider, invites arrive as real emails with click-to-accept links.

---

## Quick Reference — All Healthchecks After Fixes

| Service | Base Image | Healthcheck Command | Endpoint |
|---------|-----------|---------------------|----------|
| `proxy` | `traefik:v2.10` | `traefik healthcheck --ping` | Built-in |
| `postgres` | `postgres:15-alpine` | `pg_isready -U coreplatform` | Built-in |
| `redis` | `redis:7-alpine` | `redis-cli -a <pw> ping` | Built-in |
| `nats` | `nats:2.9-alpine` | `wget -q --spider` | `http://localhost:8222/healthz` |
| `hyperswitch` | `juspaydotin/hyperswitch-router:latest` | `curl -f` | `http://localhost:8080/health` |
| `killbill` | `killbill/killbill:0.24.11` | `curl -f` | `http://localhost:8080/1.0/healthcheck` |
| `nats-kb-bridge` | Custom (Alpine) | `curl -f` | `http://localhost:8081/health` |
| `tazama-auth` | Custom (Alpine) | `wget -q --spider` | `http://localhost:8080/health` |
| `tazama-rule-exec` | Custom (Alpine) | `wget -q --spider` | `http://localhost:8080/health` |

---

## General Tips

### Debugging a stuck `docker compose up -d`

```bash
# Check which containers are unhealthy
docker ps --filter "health=unhealthy"

# Get the health log (shows last 5 check outputs)
docker inspect --format='{{json .State.Health}}' <container-name>

# Stream live logs
docker logs -f <container-name>
```

### The `version` attribute warning

```
level=warning msg="the attribute `version` is obsolete, it will be ignored"
```

This is harmless. Modern Docker Compose (v2+) ignores the `version: '3.8'` key. You can safely remove line 1 from `docker-compose.yml` to suppress the warning, but it won't break anything if left in.

### Alpine images and `curl` vs `wget`

Alpine Linux uses BusyBox, which includes `wget` but **not** `curl`. When writing healthchecks for any Alpine-based image:

| Need | Use |
|------|-----|
| Simple "is it up?" check | `wget -q --spider <url>` |
| Need response body/headers | `wget -qO- <url>` |
| Full `curl` functionality | Add `RUN apk add --no-cache curl` to your Dockerfile |

### Service boot order

The dependency chain enforced by `depends_on` + `condition: service_healthy`:

```
postgres ─┬─→ hyperswitch
redis ────┤
nats ─────┤─→ killbill ──→ nats-kb-bridge
          │
          ├─→ tazama-auth ──→ tazama-rule-exec ──┬─→ tazama-rule-studio
          │                                       └─→ case-management
          └───────────────────────────────────────────┘
```

If a downstream service fails to start, always check its dependencies first — the root cause is usually an unhealthy upstream container, not the failing service itself.
