import { NextRequest, NextResponse } from "next/server";
import { hyperswitchFetch } from "@/lib/hyperswitch";

/**
 * GET /api/checkout/[session]
 *
 * Returns checkout session details including the client_secret
 * needed to initialize Hyperswitch Elements on the frontend.
 *
 * If the session ID is a valid payment_id, retrieves it.
 * Otherwise, creates a new payment intent for the checkout.
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
      return NextResponse.json({
        payment_id: payment.payment_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        client_secret: payment.client_secret,
      });
    }

    // Check if this is an existing payment ID
    if (session.startsWith("pay_")) {
      const payment = await hyperswitchFetch<any>(`/payments/${session}`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      return NextResponse.json({
        payment_id: payment.payment_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        client_secret: payment.client_secret,
      });
    }

    // Create a new payment intent for this checkout session
    const amount = Number(searchParams.get("amount")) || 5000;
    const currency = searchParams.get("currency") || "USD";
    const description = searchParams.get("description") || "Checkout payment";
    const email = searchParams.get("email") || undefined;

    const payment = await hyperswitchFetch<any>("/payments", {
      method: "POST",
      body: JSON.stringify({
        amount,
        currency,
        description,
        confirm: false,
        capture_method: "automatic",
        authentication_type: "no_three_ds",
        ...(email ? { billing: { email } } : {}),
      }),
    });

    return NextResponse.json({
      payment_id: payment.payment_id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      client_secret: payment.client_secret,
    });
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
