# Phase 3 — Sandbox/Production Dual-Mode Alignment

> **Status:** Code complete — backbone, env config, keys, data isolation, UX guardrails,
> checkout alignment, and env docs are implemented. Final gate (matrix rows 1-7, 9)
> requires a running stack with dual credentials for live verification.
> **Owner:** porthos-lang / OpenPay
> **Depends on:** Phase 2 (env consolidation, profiles), Vercel deploy fix (Framework Preset = Next.js)
> **Definition of Done:** A merchant can flip the dashboard between **Test** and **Live**
> and see the *same* product backed by *separate* credentials, *separate* data, and the
> correct API keys — with no way to accidentally send a live payment while in test mode.

---

## 1. Why this phase exists

Today "sandbox vs production" is only a **client-side toggle**:

- `apps/merchant-dashboard/src/lib/sandbox-mode.tsx` stores `openpay_mode` in
  `localStorage`. The **server never sees the mode** — every API route and the
  `hyperswitch.ts` client always talk to the **same** `HYPERSWITCH_URL` /
  `HYPERSWITCH_API_KEY`.
- API keys are **fake random strings kept in localStorage**
  (`openpay_api_keys`). They are never validated against the backend, are not
  publishable/secret aware, and are shared between modes (filtered only by prefix).
- The mode toggle has **no guardrails** — nothing stops a "Live" key from being used in
  test mode or vice versa, and sandbox/live data can silently mix.

Phase 3 aligns the mode concept **end-to-end**: env config → server → API keys → data →
checkout → dashboard UX.

---

## 2. Current state (what exists already)

| Area | File(s) | Status |
|------|---------|--------|
| Mode context (client) | `src/lib/sandbox-mode.tsx` | Exists — localStorage `openpay_mode` |
| Key prefixes + helpers | `src/lib/constants.ts` | Exists — `op_test_`/`op_live_`, `isTestKey()`/`isLiveKey()` |
| Hyperswitch client | `src/lib/hyperswitch.ts` | Single `HYPERSWITCH_URL` + `HYPERSWITCH_API_KEY` env |
| API routes | `src/app/api/**/route.ts` | No mode awareness (single proxy) |
| API keys page | `src/app/(dashboard)/settings/api-keys/page.tsx` | localStorage fakes; inline duplicate of `getKeyMode()` |
| Dashboard Control Center | `payment-system/hyperswitch/config/dashboard.toml` | `test_processors = true`, `test_live_toggle = true`, `is_live_mode = false` |
| Router env | `docker-compose.yml` (hyperswitch service) | `RUN_ENV: development` (sandbox = test processors) |

---

## 3. Work breakdown

### 3.1 Mode becomes server-aware (the backbone)

Nothing else works until the server knows which mode a request belongs to.

- [x] **Cookie-based mode.** In `SandboxModeProvider` (`src/lib/sandbox-mode.tsx`),
      also write a `document.cookie` `openpay_mode=sandbox|production` (same value as
      localStorage) so Next.js Server Components / route handlers can read it.
- [x] **Server helper.** Add `src/lib/mode.ts` with:
      - `getMode(request?): "sandbox" | "production"` — reads cookie, falls back to the
        `?mode=` query param, then to `NEXT_PUBLIC_OPENPAY_MODE` env, then `"sandbox"`.
      - `validateMode(x): "sandbox" | "production" | null` for API input.
- [x] **API routes carry mode.** Update every route handler in `src/app/api/**/route.ts`
      (payments, customers, checkout, refunds) to read mode via `getMode(request)` and pass
      it into the underlying `hyperswitch.ts` call.
- [x] **Client sends mode.** `hyperswitchFetch()` adds an `X-OpenPay-Mode` header (from the
      cookie) when running in the browser, and the server prefers it over the cookie.

**Acceptance:** curl `/api/payments?mode=sandbox` and `?mode=production` hit different
credentials (next section) and return distinct responses.

### 3.2 Dual credential env config

- [x] **Split env vars** in the root `.env.example` (and the Hyperswitch block in
      `docker-compose.yml`) into per-mode pairs:
      - `HYPERSWITCH_URL_TEST` / `HYPERSWITCH_URL_LIVE`
      - `HYPERSWITCH_API_KEY_TEST` / `HYPERSWITCH_API_KEY_LIVE`
      - `NEXT_PUBLIC_HYPERSWITCH_URL_TEST|LIVE`,
        `NEXT_PUBLIC_OPENPAY_PUBLISHABLE_KEY_TEST|LIVE`
      - Keep `HYPERSWITCH_URL` / `HYPERSWITCH_API_KEY` as the legacy single fallback so
        existing `.env` files don't break.
- [x] **`hyperswitch.ts` mode resolution.** Build the base URL + API key from
      `getMode()`: `…_TEST`/`…_LIVE` first, legacy single value second, hardcoded
      `http://localhost:8081` last. Log/reject a mismatch (e.g. live mode with only a test
      key configured → throw a clear `HyperswitchError` instead of silently using it).
- [x] **Vercel env vars.** For the deployed dashboard, add the per-environment sets in
      the Vercel dashboard (Production env → `_LIVE`, Preview → `_TEST`) and document that
      in `docs/PHASE_3_TODO` → check `docs/self-hosting/env-vars` gets the new vars.
      → Documented in env-vars page; Vercel dashboard configuration is a deploy-time step
      (Production env → `HYPERSWITCH_URL_LIVE`/`HYPERSWITCH_API_KEY_LIVE`, Preview → `_TEST`).
- [x] **Update docs** `apps/merchant-dashboard/src/app/docs/self-hosting/env-vars/page.tsx`
      and `docs/self-hosting/email-delivery` cross-links with the new per-mode table.

**Acceptance:** with only test credentials configured, a live-mode request fails fast with
a descriptive error rather than silently using the test key.

### 3.3 Real per-mode API keys (replace localStorage fakes)

- [x] **Backend source of truth.** Replace `listApiKeys/createApiKey/deleteApiKey`
      (localStorage, `src/lib/hyperswitch.ts`) with Hyperswitch-backed calls. Verify which
      endpoint exists in router `v1.125.0` (e.g. `/api_keys` or the Control Center API) and
      add a note here + in `docs/HYPERSWITCH_SIGNUP_TROUBLESHOOTING.md` about the exact
      route shape if it diverges.
- [x] **Publishable vs secret.** Model Stripe-like pairs: `pk_*` (publishable, used by
      checkout) and `sk_*` (secret, used by server routes). Extend `src/lib/types.ts`
      `ApiKey` with `role: "publishable" | "secret"` and `mode`.
- [x] **Single key listing, per-mode filter.** Keep the existing UI pattern in
      `api-keys/page.tsx` (one list, filtered by mode) but drive it from the backend list;
      delete the inline `getKeyMode()` in favor of `isTestKey/isLiveKey` from
      `src/lib/constants.ts` (de-duplicate).
- [x] **Never echo the secret twice.** Keep "copy once" reveal behavior for `sk_*` keys.

**Acceptance:** creating a key in Test mode yields `op_test_…` (or `sk_test_…`), creating
one in Live yields `op_live_…`; keys persist across sessions and revoke through the
backend, not localStorage.

### 3.4 Data isolation between modes

- [x] **Two merchant profiles.** In Hyperswitch, create (or document the creation of) two
      merchant accounts / business profiles — one for test, one for live — and map
      `getMode()` → account id. Investigate whether Hyperswitch `v1.125.0` supports a
      `test_mode` flag per merchant connector (the dashboard has `test_live_toggle`).
      → Implemented via `getMerchantId(mode)` (`HYPERSWITCH_MERCHANT_ID_TEST|LIVE`,
      default `"default"`) mapped from `getMode()`.
- [x] **Namespace the local caches.** `openpay_api_keys`, `openpay_business_profile`
      caches in `hyperswitch.ts` must be keyed by mode
      (`openpay_api_keys:sandbox`) so switching modes never leaks a live key into the test
      list (and vice versa).
- [x] **Payments/customers never mix.** Confirm sandbox payments and live payments land in
      different scopes server-side; if Hyperswitch can't separate them, gate test-mode
      write operations behind a clearly-labeled "test processors only" config and document
      the limitation. → Isolation comes from per-mode merchant ids + per-mode secret keys;
      live requests with only test credentials fail fast (503) rather than mixing scopes.

**Acceptance:** switching the toggle changes both the visible API keys and the underlying
payment/customer data scope; no record created in Test is visible in Live.

### 3.5 Dashboard UX guardrails

- [x] **Mode badge everywhere.** The dashboard header (see `src/components/topbar.tsx`,
      where the toggle lives) shows a persistent **Test** / **Live** pill; each list page
      (payments, customers, subscriptions, invoices) shows the active mode in its title row.
      → Added `src/components/mode-badge.tsx`; wired into topbar toggle, payments/customers/
      subscriptions/invoices list + detail title rows.
- [x] **Live-mode confirmation.** Add a confirm step for destructive/live actions
      (create live key, refund a live payment, send a live invoice) when `mode ===
      "production"`.
- [x] **No cross-mode sneaking.** In `api-keys/page.tsx`, the "unknown" fallback bucket
      (keys with no known prefix) currently appears in *both* modes — scope it to sandbox
      only, or drop it.
- [x] **Env-var state banner.** If the active mode has no matching credential configured,
      show an amber banner (reuse the pattern in
      `src/components/profile-error-banner.tsx`) pointing to the env setup instead of
      silently degrading. → Added `src/components/mode-config-banner.tsx`, wired into
      `(dashboard)/layout.tsx`.

**Acceptance:** a reviewer cannot find a flow where live-mode keys/data are reachable from
the test view without an explicit, confirming action.

### 3.6 Checkout & payment flow alignment

- [x] **Checkout carries mode.** `src/app/(public)/checkout/[session]/page.tsx` and the
      pay route `src/app/api/checkout/[session]/pay/route.ts` resolve the mode from the
      session/payment object (not the browser cookie) so a live payment link is always
      processed as live.
- [x] **Publishable key in checkout.** The checkout page loads
      `NEXT_PUBLIC_OPENPAY_PUBLISHABLE_KEY_<MODE>` for the resolved mode; never the secret.
- [x] **Failure surfacing.** Live-mode payment attempts should show the clear error from
      3.2 (missing live credential) in the checkout UI rather than a generic failure.

**Acceptance:** a live checkout session succeeds only when live credentials exist, and its
payment appears under the Live view — never the Test view.

### 3.7 Verification & acceptance matrix (final gate)

Run every row against a freshly-started stack
(`docker compose --profile core up -d`) and tick:

| # | Check | Pass |
|---|-------|------|
| 1 | Test mode shows `op_test_` keys only; Live shows `op_live_` only | ☐ |
| 2 | `/api/payments?mode=sandbox` returns different data than `?mode=production` | ☐ |
| 3 | Creating a key in Live requires the confirm dialog | ☐ |
| 4 | Live mode with only test creds configured errors clearly (API + UI) | ☐ |
| 5 | A live checkout session cannot be paid with test-mode credentials | ☐ |
| 6 | Test-created payment/customer never appears in Live view | ☐ |
| 7 | Toggle persists across refresh (localStorage + cookie agree) | ☐ |
| 8 | `pnpm build` (in `apps/merchant-dashboard`) passes after all changes | ☑ |
| 9 | Deployed Vercel preview env has `_TEST` vars; production has `_LIVE` | ☐ |
| 10 | `docs/self-hosting/env-vars` documents every new per-mode var | ☑ |

---

## 4. Out of scope (parked for later phases)

- Multi-provider (PayStack/Stripe/…) routing verification → **Phase 4**
- Webhooks per-mode delivery (needs Phase 4 connector routing)
- Card/bank network simulation beyond Hyperswitch test processors

---

## 5. Open questions to resolve before/while implementing

1. Does Hyperswitch `v1.125.0` expose a per-mode (test/live) merchant API key endpoint,
   or must we implement key validation + issuance ourselves behind the dashboard API?
   → **Resolved:** the router exposes `GET /api_keys/list`, `POST /api_keys/{merchant_id}`,
   `DELETE /api_keys/{key_id}`. The dashboard proxies them via `/api/api-keys` and
   `src/lib/hyperswitch.ts` (`listHyperApiKeys`/`createHyperApiKey`/`revokeHyperApiKey`).
   Keys are per-merchant-account; test/live separation comes from
   `HYPERSWITCH_MERCHANT_ID_TEST|LIVE` + per-mode secret keys.
2. Can a single Hyperswitch merchant account hold both test and live connectors, or do we
   need two merchant accounts (→ affects 3.4)?
3. Should mode be per-*user* (a cookie on the browser) or per-*team* (persisted in a
   business profile)? Phase 3 assumes per-browser cookie for speed, but flag for Phase 5.
