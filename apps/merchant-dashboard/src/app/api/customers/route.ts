import { NextRequest, NextResponse } from "next/server";
import { listCustomers } from "@/lib/hyperswitch";
import { getMode } from "@/lib/mode";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") || "20");
  const starting_after = searchParams.get("starting_after") || undefined;
  const mode = getMode(request);

  try {
    const data = await listCustomers({ limit, starting_after }, mode);
    return NextResponse.json(data, { headers: { "X-OpenPay-Mode": mode } });
  } catch {
    return NextResponse.json({ data: [], next: null });
  }
}
