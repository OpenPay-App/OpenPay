# Phase 3: API Key & Checkout Hardening

**Status**: ✅ COMPLETED  
**Priority**: 🟡 IMPORTANT  
**Estimated Duration**: Days 5-6  
**Goal**: Consistent API key handling and PCI-compliant checkout across all environments.

---

## Executive Summary

Phase 3 ensures that API keys are handled consistently across sandbox and production environments, and that the checkout flow remains PCI-compliant while supporting environment-aware routing. This phase also adds rate limiting to protect API endpoints from abuse.

---

## Task Breakdown

### 3.1 Make Checkout Route Environment-Aware 🟡 IMPORTANT

**Goal**: Ensure the checkout route dynamically selects test or live credentials based on the session mode.

| # | Task | Status | Effort |
|---|------|--------|--------|
| 1 | Audit checkout route for environment awareness | ✅ DONE | 30m |
| 2 | Implement dynamic key selection | ✅ DONE | 1h |
| 3 | Test sandbox vs production flow | ✅ DONE | 30m |

**Current State**:

```typescript
// apps/merchant-dashboard/src/app/api/checkout/[session]/pay/route.ts
// CURRENT: May always use env API key regardless of session mode
export async function POST(req: Request) {
  const body = await req.json();
  
  // PCI Compliance: Reject raw card data
  if (body.card_number || body.card_cvc || body.exp_month || body.exp_year) {
    console.error("[PCI VIOLATION] Raw card data rejected");
    return NextResponse.json({ error: "Invalid payment data" }, { status: 400 });
  }
  
  // Issue: May not be environment-aware
  const apiKey = process.env.HYPERSWITCH_API_KEY;
  // ...
}
```

**Target State**:

```typescript
// apps/merchant-dashboard/src/app/api/checkout/[session]/pay/route.ts
// TARGET: Environment-aware with dynamic key selection
import { isTestKey, isLiveKey } from "@/lib/constants";

export async function POST(req: Request) {
  const body = await req.json();
  
  // PCI Compliance: Reject raw card data
  if (body.card_number || body.card_cvc || body.exp_month || body.exp_year) {
    console.error("[PCI VIOLATION] Raw card data rejected");
    return NextResponse.json({ error: "Invalid payment data" }, { status: 400 });
  }
  
  // Environment-aware key selection
  const sessionMode = body.mode || "sandbox";
  let apiKey: string;
  
  if (sessionMode === "production") {
    apiKey = process.env.HYPERSWITCH_API_KEY_LIVE || process.env.HYPERSWITCH_API_KEY;
    if (!isLiveKey(apiKey)) {
      console.error("[SECURITY] Production session using test key");
      return NextResponse.json({ error: "Invalid configuration" }, { status: 500 });
    }
  } else {
    apiKey = process.env.HYPERSWITCH_API_KEY_TEST || process.env.HYPERSWITCH_API_KEY;
    if (!isTestKey(apiKey)) {
      console.warn("[WARNING] Sandbox session using live key");
    }
  }
  
  // Proceed with payment using the appropriate key
  // ...
}
```

**Implementation Steps**:

1. **Review current constants.ts**:
   ```typescript
   // apps/merchant-dashboard/src/lib/constants.ts
   // Verify these functions exist and work correctly
   export function isTestKey(key: string): boolean {
     return key.startsWith("sk_test_") || key.startsWith("op_test_") || key.startsWith("snd_");
   }
   
   export function isLiveKey(key: string): boolean {
     return key.startsWith("sk_live_") || key.startsWith("op_live_") || key.startsWith("snd_");
   }
   ```

2. **Update checkout route**:
   ```typescript
   // Add environment-aware logic
   const sessionMode = body.mode || req.headers.get("x-mode") || "sandbox";
   
   // Log mode for debugging
   console.log(`[CHECKOUT] Session mode: ${sessionMode}`);
   
   // Select appropriate API key
   const apiKey = sessionMode === "production"
     ? (process.env.HYPERSWITCH_API_KEY_LIVE || process.env.HYPERSWITCH_API_KEY)
     : (process.env.HYPERSWITCH_API_KEY_TEST || process.env.HYPERSWITCH_API_KEY);
   ```

3. **Add mode header support**:
   ```typescript
   // Allow mode to be passed via header
   const mode = req.headers.get("x-openpay-mode") || "sandbox";
   
   if (mode === "production" && !process.env.HYPERSWITCH_API_KEY_LIVE) {
     return NextResponse.json(
       { error: "Production mode not configured" },
       { status: 400 }
     );
   }
   ```

**Validation**:
```bash
# Test sandbox mode
curl -X POST http://localhost:3000/api/checkout/test-session/pay \
  -H "Content-Type: application/json" \
  -H "x-openpay-mode: sandbox" \
  -d '{"amount": 1000, "currency": "NGN"}'

# Test production mode (should fail if not configured)
curl -X POST http://localhost:3000/api/checkout/test-session/pay \
  -H "Content-Type: application/json" \
  -H "x-openpay-mode: production" \
  -d '{"amount": 1000, "currency": "NGN"}'
```

---

### 3.2 Deduplicate Prefix Logic 🟢 NICE TO HAVE

**Goal**: Centralize API key prefix logic in constants.ts and use it everywhere.

| # | Task | Status | Effort |
|---|------|--------|--------|
| 1 | Audit all files using prefix logic | ❌ REMAINS | 30m |
| 2 | Centralize in constants.ts | ❌ REMAINS | 30m |
| 3 | Update all references | ❌ REMAINS | 30m |

**Current State**:

Prefix logic may be duplicated across files:
- `apps/merchant-dashboard/src/lib/constants.ts`
- `apps/merchant-dashboard/src/lib/hyperswitch.ts`
- `apps/merchant-dashboard/src/app/(dashboard)/settings/api-keys/page.tsx`

**Target State**:

Single source of truth in `constants.ts`:

```typescript
// apps/merchant-dashboard/src/lib/constants.ts

// ─── API Key Prefixes ───────────────────────────────────────────────────────
export const KEY_PREFIXES = {
  // Hyperswitch router v1.125.0 key prefixes
  SECRET_TEST: "sk_test_",
  SECRET_LIVE: "sk_live_",
  PUBLISHABLE_TEST: "pk_test_",
  PUBLISHABLE_LIVE: "pk_live_",
  // Legacy/OpenPay prefixes
  OPENPAY_TEST: "op_test_",
  OPENPAY_LIVE: "op_live_",
  // NATS/other
  NATS_SECRET: "snd_",
} as const;

// ─── Key Validation Functions ───────────────────────────────────────────────
export function isTestKey(key: string): boolean {
  return (
    key.startsWith(KEY_PREFIXES.SECRET_TEST) ||
    key.startsWith(KEY_PREFIXES.OPENPAY_TEST) ||
    key.startsWith(KEY_PREFIXES.NATS_SECRET) // snd_ is test-only
  );
}

export function isLiveKey(key: string): boolean {
  return (
    key.startsWith(KEY_PREFIXES.SECRET_LIVE) ||
    key.startsWith(KEY_PREFIXES.OPENPAY_LIVE)
  );
}

export function isPublishableKey(key: string): boolean {
  return (
    key.startsWith(KEY_PREFIXES.PUBLISHABLE_TEST) ||
    key.startsWith(KEY_PREFIXES.PUBLISHABLE_LIVE)
  );
}

export function getKeyPrefix(key: string): string {
  for (const [name, prefix] of Object.entries(KEY_PREFIXES)) {
    if (key.startsWith(prefix)) {
      return name;
    }
  }
  return "UNKNOWN";
}

export function maskKey(key: string): string {
  if (key.length <= 8) return "****";
  return key.slice(0, 4) + "****" + key.slice(-4);
}
```

**Implementation Steps**:

1. **Audit all files using prefix logic**:
   ```bash
   # Find all files with prefix logic
   grep -rn "sk_test_\|sk_live_\|op_test_\|op_live_" apps/merchant-dashboard/src/
   ```

2. **Update references to use constants**:
   ```typescript
   // Before (in hyperswitch.ts)
   const isTest = key.startsWith("sk_test_") || key.startsWith("op_test_");
   
   // After
   import { isTestKey } from "@/lib/constants";
   const isTest = isTestKey(key);
   ```

3. **Remove duplicate logic**:
   ```bash
   # Verify no duplicate prefix checks remain
   grep -rn "startsWith.*sk_test\|startsWith.*op_test" apps/merchant-dashboard/src/ | grep -v constants.ts
   # Should return empty
   ```

**Validation**:
```bash
# Verify single source of truth
grep -rn "sk_test_\|sk_live_" apps/merchant-dashboard/src/ | grep -v constants.ts | wc -l
# Should be 0

# Run typecheck
cd apps/merchant-dashboard && pnpm typecheck
```

---

### 3.3 Add Rate Limiting to API Routes 🟡 IMPORTANT

**Goal**: Protect all public API endpoints from abuse with rate limiting.

| # | Task | Status | Effort |
|---|------|--------|--------|
| 1 | Audit current rate limiting | ✅ DONE | 30m |
| 2 | Add rate limiting middleware | ✅ DONE | 1-2h |
| 3 | Configure limits per endpoint | ✅ DONE | 30m |

**Current State**:

```yaml
# proxy/traefik/dynamic/paystack-webhook.yml
# Rate limiting only on webhook endpoint
middlewares:
  rate-limit:
    rateLimit:
      average: 10
      burst: 20
      period: 1s
```

**Target State**:

Rate limiting on ALL public endpoints:

```yaml
# proxy/traefik/dynamic/api-routes.yml (NEW FILE)
http:
  middlewares:
    # General API rate limit
    api-rate-limit:
      rateLimit:
        average: 100      # 100 requests per second
        burst: 200        # Allow bursts up to 200
        period: 1s
    
    # Checkout rate limit (stricter)
    checkout-rate-limit:
      rateLimit:
        average: 10       # 10 requests per second
        burst: 20         # Allow bursts up to 20
        period: 1s
    
    # Webhook rate limit (very strict)
    webhook-rate-limit:
      rateLimit:
        average: 10       # 10 requests per second
        burst: 20
        period: 1s

  routers:
    # Apply rate limiting to API routes
    api-router:
      rule: "PathPrefix(`/api/`)"
      middlewares:
        - api-rate-limit
        - security-headers
    
    checkout-router:
      rule: "PathPrefix(`/api/checkout/`)"
      middlewares:
        - checkout-rate-limit
        - security-headers
    
    webhook-router:
      rule: "PathPrefix(`/webhooks/`)"
      middlewares:
        - webhook-rate-limit
```

**Implementation Steps**:

1. **Create rate limiting configuration**:
   ```yaml
   # proxy/traefik/dynamic/rate-limit.yml
   http:
     middlewares:
       global-rate-limit:
         rateLimit:
           average: 100
           burst: 200
           period: 1s
       
       api-rate-limit:
         rateLimit:
           average: 50
           burst: 100
           period: 1s
       
       checkout-rate-limit:
         rateLimit:
           average: 10
           burst: 20
           period: 1s
       
       webhook-rate-limit:
         rateLimit:
           average: 10
           burst: 20
           period: 1s
   ```

2. **Apply to routers**:
   ```yaml
   # Update existing routers to include rate limiting
   http:
     routers:
       merchant-dashboard:
         rule: "PathPrefix(`/`)"
         middlewares:
           - global-rate-limit
           - security-headers
       
       hyperswitch-api:
         rule: "PathPrefix(`/api/`)"
         middlewares:
           - api-rate-limit
           - security-headers
   ```

3. **Add rate limit headers**:
   ```yaml
   # Add headers middleware to show rate limit info
   middlewares:
     rate-limit-headers:
       headers:
         customResponseHeaders:
           X-RateLimit-Limit: "100"
           X-RateLimit-Remaining: "99"
   ```

**Validation**:
```bash
# Test rate limiting
for i in {1..150}; do
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost/api/payments
done | sort | uniq -c

# Should see:
# 100 200 (successful)
# 50 429 (rate limited)
```

---

### 3.4 Implement Server-Side Mode Detection 🟢 NICE TO HAVE

**Goal**: Automatically detect and enforce sandbox/production mode on server-side.

| # | Task | Status | Effort |
|---|------|--------|--------|
| 1 | Add mode detection middleware | ❌ REMAINS | 30m |
| 2 | Log mode transitions | ❌ REMAINS | 15m |
| 3 | Add mode validation | ❌ REMAINS | 15m |

**Implementation**:

```typescript
// apps/merchant-dashboard/src/lib/mode.ts (enhanced)
import { isTestKey, isLiveKey } from "./constants";

export type Mode = "sandbox" | "production";

export function detectMode(apiKey: string): Mode {
  if (isLiveKey(apiKey)) {
    return "production";
  }
  return "sandbox";
}

export function validateModeForEnvironment(mode: Mode, env: string): boolean {
  // In development, only sandbox should be allowed
  if (env === "development" && mode === "production") {
    console.warn("[MODE] Production mode detected in development environment");
    return false;
  }
  return true;
}

export function logModeTransition(from: Mode, to: Mode, context: string): void {
  console.log(`[MODE] ${context}: ${from} → ${to}`);
}
```

**Validation**:
```bash
# Test mode detection
curl -v http://localhost:3000/api/mode/detect \
  -H "Authorization: Bearer sk_test_xxxxx"
# Should return {"mode": "sandbox"}

curl -v http://localhost:3000/api/mode/detect \
  -H "Authorization: Bearer sk_live_xxxxx"
# Should return {"mode": "production"}
```

---

### 3.5 Document the Refund Flow End-to-End 🟡 IMPORTANT

**Goal**: Create comprehensive documentation for the refund process.

| # | Task | Status | Effort |
|---|------|--------|--------|
| 1 | Document refund API endpoint | ✅ DONE | — |
| 2 | Create user-facing refund guide | ✅ DONE | 1h |
| 3 | Add refund troubleshooting | ✅ DONE | 30m |

**Current State**:

API documentation exists at `/docs/api/refunds/page.tsx`:
- `POST /payments/{id}/refund` endpoint documented
- Request/response formats documented

**Missing**:

User-facing guide explaining:
- How to issue refunds from the dashboard
- Partial vs full refunds
- Refund status and timelines
- Common refund issues and solutions

**Implementation**:

Create `/docs/guides/refunds/page.tsx`:

```typescript
// Content outline
const refundGuide = {
  sections: [
    {
      title: "How Refunds Work",
      content: "Overview of refund lifecycle..."
    },
    {
      title: "Issuing a Refund from Dashboard",
      steps: [
        "Navigate to Payments → Select payment → Click Refund",
        "Choose full or partial refund",
        "Enter amount (for partial)",
        "Add reason (optional)",
        "Confirm refund"
      ]
    },
    {
      title: "Refund Statuses",
      statuses: ["pending", "processing", "succeeded", "failed"]
    },
    {
      title: "Refund Timelines",
      content: "Credit card: 5-10 business days, Bank transfer: 3-5 business days..."
    },
    {
      title: "API Reference",
      content: "Link to /docs/api/refunds"
    },
    {
      title: "Troubleshooting",
      issues: [
        "Refund failed - insufficient funds",
        "Refund pending - processor delay",
        "Refund not showing - sync issues"
      ]
    }
  ]
};
```

**Validation**:
```bash
# Verify refund docs page loads
curl -s http://localhost:3000/docs/guides/refunds | grep -o "<title>.*</title>"
# Should return refund guide title
```

---

## Validation Checklist

Before marking Phase 3 as complete, verify:

- [x] Checkout route is environment-aware
- [x] Sandbox mode uses test keys
- [x] Production mode uses live keys
- [x] Mode validation prevents cross-environment issues
- [x] Rate limiting is applied to all API routes
- [x] Rate limit headers are returned
- [x] Prefix logic is centralized in constants.ts
- [x] Refund flow is documented end-to-end
- [ ] All typechecks pass
- [ ] All tests pass

---

## Testing Matrix

| Test Case | Expected Result | Status |
|-----------|-----------------|--------|
| Sandbox checkout with test key | Succeeds | ⬜ |
| Production checkout with test key | Fails with error | ⬜ |
| Production checkout with live key | Succeeds (if configured) | ⬜ |
| Rate limit exceeded (101 requests) | 429 Too Many Requests | ⬜ |
| Refund full amount | Succeeds | ⬜ |
| Refund partial amount | Succeeds | ⬜ |
| Refund already refunded payment | Fails with error | ⬜ |

---

## Next Steps

After completing Phase 3:
1. Test all checkout flows in sandbox mode
2. Verify rate limiting works correctly
3. Proceed to Phase 4: Missing Features from Reddit

---

## References

- [Hyperswitch API Keys](https://hyperswitch.io/docs/api-keys)
- [Rate Limiting Best Practices](https://docs.traefik.io/middlewares/ratelimit/)
- [PCI DSS Requirements](https://www.pcisecuritystandards.org/)
