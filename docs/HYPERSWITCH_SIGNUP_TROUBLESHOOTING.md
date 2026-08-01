# Hyperswitch Self-Hosted Signup — Error Log & Fixes

> **Scope:** Getting the self-hosted Hyperswitch signup journey working end-to-end —
> dashboard `localhost:9000` ↔ payment router `localhost:8081` — from clicking
> **"Get started, for free!"** to landing inside the Control Center.
> **Stack:** Hyperswitch router `v1.125.0`, Control Center dashboard `2026.06.30.0`, MailHog, PostgreSQL, Redis. All via `docker compose --profile core up -d`.

Every error we hit, its root cause, and the fix. The single root-cause fix for the
whole saga is **Error #1**. Everything after that is either the magic-link/TOTP
journey mechanics or our own tooling friction.

---

## Error #1 — Signup fails with `401 UR_01 "Incorrect email or password"` (the root cause)

### Symptom
`POST /user/connect_account` with a brand-new, never-seen email returns:

```json
{"error":{"type":"invalid_request","message":"Incorrect email or password","code":"UR_01"}}
```

Same for `POST /user/sign_up`/signin paths. The dashboard banner shows "Invalid email or password".
No user row is created.

### Root cause
`docker-compose.yml` set the router env to:

```yaml
RUN_ENV: docker_compose
```

`RUN_ENV` is parsed with `router_env::Env` (`development | integ | sandbox | production`).
`docker_compose` is not a valid variant, so it silently fell back to **`production`**.
In `crates/router/src/core/user.rs:296`, the `connect_account` handler rejects
**new-user** signups in a production env with `UserErrors::InvalidCredentials`
(→ `UR_01`). Existing verified users can still sign in — only signup is blocked.

This is deliberate anti-signup behavior in production; it just wasn't supposed to be
running in "production".

### Red herrings we ruled out first
- `ROUTER__USER__RECON_SIGNUP_ALLOWED` / `OPEN_SIGNUP_ALLOWED` env flags **do not exist**
  in the `v1.125.0` binary (verified against the binary with `strings`). Don't add them.
- `HYPERSWITCH_ENVIRONMENT=development` in `payment-system/hyperswitch/.env` is **not read**
  by the router's env logic. Only `RUN_ENV` matters.

### Fix
In `docker-compose.yml` (hyperswitch service `environment:` block):

```yaml
# Must be a valid router_env::Env value ("development"). "docker_compose" was
# being parsed as unknown and falling back to "production", which makes the
# /user/connect_account signup flow reject new users with "Incorrect email or password".
RUN_ENV: development
```

Recreate the container:

```powershell
docker compose --profile core up -d --force-recreate hyperswitch
```

### Verification
```powershell
docker exec core-hyperswitch sh -c "printenv RUN_ENV"            # -> development
docker logs core-hyperswitch | Select-String '"env":"development"' # log spans carry it
curl.exe -s -X POST http://localhost:8081/user/connect_account -H "Content-Type: application/json" -d '{"email":"test.signup@proton.me"}'
# -> 200 {"is_email_sent":true}
```

---

## Error #2 — Magic-link token unreadable from the MailHog email (quoted-printable)

### Symptom
The confirm email's link is `http://localhost:9000/user/verify_email?token=<jwt>`,
but naive text extraction yields garbage — tokens wrapped in `=3D` and broken by
`=\r\n` line breaks.

### Root cause
MailHog stores the message body as **quoted-printable** HTML. In QP encoding:
- soft line breaks are `=<CRLF>` (the `=` must be dropped),
- literal `=` becomes `=3D`.

### Fix
Decode before extracting:

```python
import re
body = re.sub(r"=\r?\n", "", body)   # remove soft line breaks
body = body.replace("=3D", "=")      # decode literal '='
m = re.search(r"token=([^\s\"'<>&]+)", body)
link_token = m.group(1)
```

### Gotcha discovered
In this version's templates, the **magic link is inside the "Welcome to the
community!" email**, not the "Thank you for signing up on Hyperswitch Dashboard!"
email. When hunting the token, scan **every** message for `token=`, don't assume it's
in the email whose subject mentions verification.

---

## Error #3 — `verify_email` route semantics: `405 IR_03` / `400 IR_04`

### Symptom
- `GET /user/verify_email?token=...` → `405 IR_03 "The HTTP method is not applicable for this API"`
- `POST /user/verify_email` without an `Authorization` header → `400 IR_04 "Missing required param: Authorization"`

### Root cause / explanation
`/user/verify_email` (v1) and `/user/v2/verify_email` are **POST-only** and require a
`SinglePurposeToken` JWT in `Authorization: Bearer`. They are the *re-verification*
routes (`verify_email_token_only_flow`, `crates/router/src/core/user.rs:2149`) — they
verify an already-known user and require a bearer whose JWT `purpose` equals the
route's expected purpose.

### Fix
None needed — this is correct API behavior. The dashboard never hits these routes for a
brand-new signup. See Error #4.

---

## Error #4 — `401 IR_17 "Access forbidden, invalid JWT token was used"` on `/user/v2/verify_email`

### Symptom
Replaying `POST /user/v2/verify_email` with the JWT returned by `/user/from_email`
fails auth with `401 IR_17`, even though the token is validly signed and not blacklisted.

### Root cause
The bearer must be a **`SinglePurposeToken`** with claims
`{ user_id, purpose, origin, path, exp, tenant_id }`
(`crates/router/src/services/authentication.rs:268-275`). During auth, the middleware
enforces an **exact purpose match**:

```rust
// authentication.rs:1534-1536
if self.0 != payload.purpose {
    return Err(UserErrors::InvalidJwtToken.into());   // IR_17
}
```

`POST /user/from_email` (`crates/router/src/core/user.rs:2284`) returns a token with
`purpose: "totp"` (the **next** step in the flow), but `/user/v2/verify_email` demands a
`verify_email`-purpose token. Hence the rejection.

The router log proved the token itself was fine — the blacklist check ran for user
`BU_07ae323b-...` (Redis `GetKey`) and only the purpose comparison failed
(`authentication.rs:1535:66`).

### Resolution — this was a **red herring**
For a **new** signup user, `NextFlow::from_origin(Origin::VerifyEmail, ...)` maps the
magic link to a **TOTP setup** flow, not to `v2/verify_email`. The dashboard's journey is:

1. Open `http://localhost:9000/user/verify_email?token=<link-token>`.
2. Frontend calls `POST /user/from_email` with `{"token": link_token}` (the bundle's
   URL-router handler at `case "user": … case "verify_email":`).
3. Response `token_type` = `totp` → Control Center renders the **TOTP setup screen**.
4. The `EmailVerify` screen (which would call `v2/verify_email`) only renders when
   `token_type` = `verify_email`, i.e. for already-verified users.

So a correct signup never calls `/user/v2/verify_email`. Stop chasing purpose mismatches.

### Frontend ground truth (how we decoded this)
The dashboard bundle lives at `/usr/src/app/dist/hyperswitch/app.js` (minified). It
contains the API route map (`VERIFY_EMAILV2 → user/v2/verify_email`,
`FROM_EMAIL → user/from_email`, `BEGIN_TOTP → user/2fa/totp/begin`, …) and the
PreLogin screen dispatch (`token_type` → component). Useful for confirming the intended
journey without a browser.

---

## Error #5 — `405 IR_03` on `POST /user/2fa/totp/begin`

### Fix
It's a **GET** route:

```powershell
curl.exe -s http://localhost:8081/user/2fa/totp/begin -H "Authorization: Bearer $SPT"
```

`begin` generates a fresh TOTP secret, stores it in Redis keyed by user id
(`TOTP_SEC_<user_id>`, TTL 15 min), and returns:

```json
{"secret": {"secret": "<BASE32>", "totp_url": "otpauth://totp/Hyperswitch:user@host?secret=..."}}
```

---

## Error #6 — `400 IR_06 "Json deserialize error: missing field 'totp'"` on totp/verify

### Symptom
Sending `{"code": "123456"}` to the TOTP verify endpoint fails with a serde error.

### Fix
The field is named **`totp`**:

```json
{"totp": "123456"}
```

---

## Error #7 — `400 UR_36 "TOTP not setup"` on `POST /user/2fa/totp/verify`

### Root cause
The **same route + method pair** dispatches to different handlers depending on HTTP method:

| Method | Handler | Purpose |
|--------|---------|---------|
| `POST /user/2fa/totp/verify` | `verify_totp` (`core/user.rs:2385`) | **Login-time** check; requires the TOTP secret already persisted in the DB (`totp_status == Set`). |
| `PUT /user/2fa/totp/verify` | `update_totp` (`core/user.rs:2432`) | **First-time setup**; reads the pending secret from Redis (written by `begin`), validates the code, then persists it encrypted and marks the user `totp_status: Set`. |

Sending `POST` for a brand-new user returns `UR_36` because no secret is in the DB yet.

### Fix
For setup, use **`PUT`**:

```powershell
curl.exe -s -X PUT http://localhost:8081/user/2fa/totp/verify -H "Authorization: Bearer $SPT" -H "Content-Type: application/json" -d "{\"totp\":\"$CODE\"}"
```

The dashboard's TOTP component confirms this: `"TWO_FA_SET" === l ? "Post" : "Put"`
(`k0e` in the bundle) — `Put` for setup, `Post` for login.

---

## Error #8 — `400 UR_37 "Invalid TOTP"` on the setup `PUT`

### Symptom
The RFC-6238 code computed for the secret returned by `begin` is rejected.

### Root cause — window alignment
TOTP parameters are standard (`SHA1`, 6 digits, 30 s step — `consts/user.rs`:
`TOTP_DIGITS=6`, `TOTP_VALIDITY_DURATION_IN_SECONDS=30`, `TOTP_TOLERANCE=1`), but the
setup path compares against **exactly the current 30-second window**:

```rust
// core/user.rs update_totp
if totp.generate_current() != req.totp.expose() { return Err(InvalidTotp) }
```

It does **not** accept the previous window (unlike `totp_rs`'s tolerance-aware
`check()`). Computing the code too early, or with a stale clock, lands outside the
window → `UR_37`. A code from `window-1`/`window-2` is always rejected.

### Fix
Generate the code immediately before sending, from the *current* window:

```python
import base64, hashlib, hmac, struct, time
secret = "…BASE32 from begin…"
key = base64.b32decode(secret + "=" * (-len(secret) % 8))
counter = int(time.time()) // 30
digest = hmac.new(key, struct.pack(">Q", counter), hashlib.sha1).digest()
o = digest[19] & 0xF
code = f"{(struct.unpack('>I', digest[o:o+4])[0] & 0x7FFFFFFF) % 1000000:06d}"
```

Container and host clocks were in sync (`date +%s` matched), so the failure was purely
a stale-window code, not skew.

---

## What "working" looks like (acceptance)

After the fixes, the full journey completes:

1. `POST /user/connect_account` → `200 {"is_email_sent":true}`.
2. Magic-link email arrives in MailHog (`http://localhost:8025`), containing
   `http://localhost:9000/user/verify_email?token=<jwt>`.
3. Opening the link in the browser runs `from_email`, lands on the TOTP setup screen,
   the user scans the QR / enters the 6-digit code.
4. The user row ends up verified in the DB:

```sql
select user_id, email, is_verified, totp_status from users where email = 'levarlux@proton.me';
-- is_verified = t   ← verified signup
```

---

## Debugging playbook (how to verify the next time)

1. **Router logs are the ground truth** — every request is logged with `env`, `flow`,
   `status_code`, and the exact source line of a failure:
   ```powershell
   docker logs core-hyperswitch | Select-String "UR_01|IR_17|VERIFY|totp" -CaseSensitive:$false
   ```
2. **Confirm the env** the router actually runs under:
   ```powershell
   docker exec core-hyperswitch sh -c "printenv RUN_ENV"
   docker logs core-hyperswitch | Select-String '"env":"' | Select-Object -First 1
   ```
3. **Inspect the token claims** (SPT vs email token) — decode the JWT payload:
   ```python
   import base64, json
   json.loads(base64.urlsafe_b64decode(token.split(".")[1] + "=" * (-len(token.split(".")[1]) % 4)))
   ```
   - Magic-link email token claims: `{ email, flow, exp, entity }` (legacy
     `email_types::EmailToken`).
   - Bearer SPT claims: `{ user_id, purpose, origin, path, exp, tenant_id }`.
4. **Track user state in PostgreSQL:**
   ```powershell
   docker exec core-postgres psql -U coreplatform -d hyperswitch -c "select email, is_verified, totp_status from users order by created_at desc;"
   ```
5. **Decode the intended frontend journey** from the Control Center bundle
   (`/usr/src/app/dist/hyperswitch/app.js`) — route map, screen dispatch, and the
   `token_type` → component mapping are all there.

---

## Key source references (v1.125.0)

| Concern | Location |
|---------|----------|
| New-user signup blocked in prod | `crates/router/src/core/user.rs:296` (`connect_account`) |
| Email-verify core flow | `crates/router/src/core/user.rs:2149` (`verify_email_token_only_flow`) |
| Magic-link → next flow | `crates/router/src/core/user.rs:2284` (`user_from_email`) |
| TOTP begin / verify / update | `crates/router/src/core/user.rs:2319` / `2385` / `2432` |
| `SinglePurposeToken` model | `crates/router/src/services/authentication.rs:268-275` |
| Purpose equality check (IR_17) | `crates/router/src/services/authentication.rs:1534-1536` |
| TOTP params | `crates/router/src/consts/user.rs` |
| TOTP generation | `crates/router/src/utils/user/two_factor_auth.rs` (`generate_default_totp`) |
