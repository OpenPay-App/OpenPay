import { NextRequest, NextResponse } from "next/server";
import { hyperswitchFetch, getPublishableKey } from "@/lib/hyperswitch";
import { getMode, validateMode, type Mode } from "@/lib/mode";

/**
 * GET /api/checkout/[session]
 *
 * Returns checkout session details including the client_secret
 * needed to initialize Hyperswitch Elements on the frontend.
 *
 * Phase 3: the mode is resolved from the payment object's metadata (stamped
 * at creation), NOT the browser cookie — so a live payment link is always
 * processed against live credentials, even when the link is opened from a
 * browser whose merchant session is in test mode.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ session: string }> }
) {
  const { session } = await params;
  const { searchParams } = new URL(request.url);

  const retrieve = searchParams.get("retrieve");

  try {
    // If retrieve=true, always attempt to fetch existing payment (used by success page)
    if (retrieve === "true") {
      const payment = await hyperswitchFetch<any>(`/payments/${session}`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      const mode = paymentMode(payment, request);
      return NextResponse.json(
        {
          payment_id: payment.payment_id,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          client_secret: payment.client_secret,
          publishable_key: getPublishableKey(mode),
          mode,
        },
        { headers: { "X-OpenPay-Mode": mode } }
      );
    }

    // Check if this is an existing payment ID
    if (session.startsWith("pay_")) {
      const payment = await hyperswitchFetch<any>(`/payments/${session}`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      const mode = paymentMode(payment, request);
      return NextResponse.json(
        {
          payment_id: payment.payment_id,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          client_secret: payment.client_secret,
          publishable_key: getPublishableKey(mode),
          mode,
        },
        { headers: { "X-OpenPay-Mode": mode } }
      );
    }

    // Create a new payment intent for this checkout session. The mode that
    // created it is stamped into the payment metadata so every later step
    // (pay, verify) resolves the same scope.
    const mode = getMode(request);
    const amount = Number(searchParams.get("amount")) || 5000;
    const currency = searchParams.get("currency") || "USD";
    const description = searchParams.get("description") || "Checkout payment";
    const email = searchParams.get("email") || undefined;

    const payment = await hyperswitchFetch<any>(
      "/payments",
      {
        method: "POST",
        resolveMode: mode,
        body: JSON.stringify({
          amount,
          currency,
          description,
          confirm: false,
          capture_method: "automatic",
          authentication_type: "no_three_ds",
          metadata: { openpay_mode: mode },
          ...(email ? { billing: { email } } : {}),
        }),
      }
    );

    return NextResponse.json(
      {
        payment_id: payment.payment_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        client_secret: payment.client_secret,
        publishable_key: getPublishableKey(mode),
        mode,
      },
      { headers: { "X-OpenPay-Mode": mode } }
    );
  } catch (error) {
    const msg = (error as Error).message || "Unknown error";
    console.error("[checkout] Error:", msg);
    // Return full error details so the frontend can display them
    return NextResponse.json(
      { error: msg, details: (error as any).status || 500 },
      { status: 500 }
    );
  }
}

/**
 * Resolve the mode for an existing payment: prefer the mode stamped into its
 * metadata at creation; fall back to the request's own mode.
 */
function paymentMode(payment: any, request: NextRequest): Mode {
  const stamped = validateMode(payment?.metadata?.openpay_mode);
  if (stamped) return stamped;
  return getMode(request);
}
