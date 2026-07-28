import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.HYPERSWITCH_URL || "http://localhost:8081";
const API_KEY = process.env.HYPERSWITCH_API_KEY || "";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ session: string }> }
) {
  const { session } = await params;
  const body = await request.json();

  try {
    // Confirm the payment with Hyperswitch
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(API_KEY ? { "api-key": API_KEY } : {}),
    };

    const res = await fetch(`${BASE_URL}/payments/${session}`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        payment_method: "card",
        payment_method_data: {
          card: {
            card_number: body.card_number,
            card_exp_month: body.exp_month,
            card_exp_year: body.exp_year,
            card_cvc: body.cvv,
          },
        },
        billing: {
          email: body.email,
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { status: "failed", error: data.error?.message || "Payment failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: data.status || data.payment_status || "succeeded",
      payment_id: data.payment_id || session,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "failed", error: (error as Error).message },
      { status: 500 }
    );
  }
}
