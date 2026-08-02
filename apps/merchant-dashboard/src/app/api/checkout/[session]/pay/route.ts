import { NextRequest, NextResponse } from "next/server";
import { hyperswitchFetch } from "@/lib/hyperswitch";
import { validateMode, type Mode } from "@/lib/mode";

/**
 * POST /api/checkout/[session]/pay
 *
 * PCI-compliant payment confirmation route.
 * Accepts a tokenized payment_method_id from the Hyperswitch SDK.
 * Raw card data (number, CVC, expiry) should NEVER reach this endpoint.
 *
 * Body: { payment_method_id: string, email?: string }
 *
 * Phase 3: the mode is resolved from the payment object's metadata (stamped at
 * creation) — never from the caller's cookie — so a live session is confirmed
 * with live credentials regardless of the caller's own mode.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ session: string }> }
) {
  const { session } = await params;
  const body = await request.json();

  // PCI Compliance: Reject any request containing raw card data
  if (body.card_number || body.card_cvc || body.exp_month || body.exp_year) {
    console.error("[PCI VIOLATION] Raw card data rejected in pay route");
    return NextResponse.json(
      { status: "failed", error: "Raw card data is not accepted. Use tokenized payment_method_id." },
      { status: 400 }
    );
  }

  if (!body.payment_method_id) {
    return NextResponse.json(
      { status: "failed", error: "payment_method_id is required" },
      { status: 400 }
    );
  }

  try {
    // Resolve the payment's own mode before confirming.
    const existing = await hyperswitchFetch<any>(`/payments/${session}`, {
      method: "POST",
      body: JSON.stringify({}),
    });
    const mode: Mode = validateMode(existing?.metadata?.openpay_mode) || "sandbox";

    // Confirm the payment with Hyperswitch using the tokenized payment method
    const data = await hyperswitchFetch<any>(`/payments/${session}`, {
      method: "POST",
      resolveMode: mode,
      body: JSON.stringify({
        confirm: true,
        payment_method: "card",
        payment_method_id: body.payment_method_id,
        ...(body.email ? { billing: { email: body.email } } : {}),
      }),
    });

    return NextResponse.json(
      {
        status: data.status || data.payment_status || "succeeded",
        payment_id: data.payment_id || session,
        mode,
      },
      { headers: { "X-OpenPay-Mode": mode } }
    );
  } catch (error) {
    return NextResponse.json(
      { status: "failed", error: (error as Error).message },
      { status: 500 }
    );
  }
}
