import { NextRequest, NextResponse } from "next/server";
import { refundPayment } from "@/lib/hyperswitch";
import { getMode } from "@/lib/mode";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const mode = getMode(request);
  try {
    const body = await request.json().catch(() => ({}));
    const result = await refundPayment(id, body.amount, mode);
    return NextResponse.json(result, { headers: { "X-OpenPay-Mode": mode } });
  } catch {
    return NextResponse.json(
      { error: "Hyperswitch unavailable — cannot process refund" },
      { status: 503 }
    );
  }
}
