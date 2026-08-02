import { NextRequest, NextResponse } from "next/server";
import { revokeHyperApiKey } from "@/lib/hyperswitch";
import { getMode } from "@/lib/mode";

/**
 * DELETE /api/api-keys/[id] — revoke an API key within the active mode's
 * merchant account scope.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const mode = getMode(request);
  try {
    await revokeHyperApiKey(mode, id);
    return NextResponse.json({ revoked: true, key_id: id }, { headers: { "X-OpenPay-Mode": mode } });
  } catch {
    return NextResponse.json(
      { error: "Failed to revoke API key" },
      { status: 500, headers: { "X-OpenPay-Mode": mode } }
    );
  }
}
