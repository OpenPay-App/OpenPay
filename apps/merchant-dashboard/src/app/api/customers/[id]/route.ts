import { NextRequest, NextResponse } from "next/server";
import { getCustomer, HyperswitchError } from "@/lib/hyperswitch";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const customer = await getCustomer(id);
    return NextResponse.json(customer);
  } catch (error) {
    if (error instanceof HyperswitchError) {
      return NextResponse.json(null, { status: 404 });
    }
    return NextResponse.json(null, { status: 500 });
  }
}
