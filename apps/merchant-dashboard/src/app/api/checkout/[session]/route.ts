import { NextRequest, NextResponse } from "next/server";
import { getPayment } from "@/lib/hyperswitch";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ session: string }> }
) {
  const { session } = await params;
  try {
    const payment = await getPayment(session);
    return NextResponse.json(payment);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
