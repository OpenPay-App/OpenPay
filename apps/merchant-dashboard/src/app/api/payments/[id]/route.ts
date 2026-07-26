import { NextRequest, NextResponse } from "next/server";
import { getPayment, HyperswitchError } from "@/lib/hyperswitch";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const payment = await getPayment(id);
    return NextResponse.json(payment);
  } catch (error) {
    if (error instanceof HyperswitchError) {
      return NextResponse.json(null, { status: 404 });
    }
    return NextResponse.json(null, { status: 500 });
  }
}
