import { NextRequest, NextResponse } from "next/server";
import { refundPayment, HyperswitchError } from "@/lib/hyperswitch";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json().catch(() => ({}));
    const result = await refundPayment(id, body.amount);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof HyperswitchError) {
      return NextResponse.json(
        { error: "Hyperswitch unavailable — cannot process refund" },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
