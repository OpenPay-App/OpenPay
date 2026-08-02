import { NextRequest, NextResponse } from "next/server";
import { getPayment } from "@/lib/hyperswitch";
import { getMode } from "@/lib/mode";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const mode = getMode(request);
  try {
    const payment = await getPayment(id, mode);
    return NextResponse.json(payment, { headers: { "X-OpenPay-Mode": mode } });
  } catch {
    return NextResponse.json(null, { status: 404 });
  }
}
