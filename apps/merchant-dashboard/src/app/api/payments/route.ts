import { NextRequest, NextResponse } from "next/server";
import { listPayments, HyperswitchError } from "@/lib/hyperswitch";
import { getMode } from "@/lib/mode";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") || "20");
  const starting_after = searchParams.get("starting_after") || undefined;
  const mode = getMode(request);

  try {
    const data = await listPayments({ limit, starting_after }, mode);
    return NextResponse.json(data, { headers: { "X-OpenPay-Mode": mode } });
  } catch (error) {
    if (error instanceof HyperswitchError) {
      return NextResponse.json({ data: [], next: null });
    }
    return NextResponse.json(
      { data: [], next: null },
      { status: 500 }
    );
  }
}
