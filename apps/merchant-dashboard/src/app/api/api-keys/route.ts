import { NextRequest, NextResponse } from "next/server";
import { listHyperApiKeys, createHyperApiKey, HyperswitchError } from "@/lib/hyperswitch";
import { getMode, validateMode } from "@/lib/mode";

/**
 * GET /api/api-keys — list API keys for the active mode (via the mode's
 * merchant account) plus the mode's publishable key.
 *
 * POST /api/api-keys — create a new secret key for the active mode. The
 * plaintext key is returned exactly once (it is stored hashed by Hyperswitch).
 */
export async function GET(request: NextRequest) {
  const mode = getMode(request);
  try {
    const data = await listHyperApiKeys(mode);
    return NextResponse.json(data, { headers: { "X-OpenPay-Mode": mode } });
  } catch (error) {
    if (error instanceof HyperswitchError) {
      return NextResponse.json(
        { data: [], publishable_key: "", error: error.message },
        { headers: { "X-OpenPay-Mode": mode } }
      );
    }
    return NextResponse.json(
      { data: [], publishable_key: "", error: "Failed to load API keys" },
      { status: 500, headers: { "X-OpenPay-Mode": mode } }
    );
  }
}

export async function POST(request: NextRequest) {
  const mode = getMode(request);
  const body = await request.json().catch(() => ({}));
  const name = typeof body?.name === "string" && body.name.trim() ? body.name.trim() : null;
  const description = typeof body?.description === "string" ? body.description : undefined;

  if (!name) {
    return NextResponse.json({ error: "Key name is required" }, { status: 400 });
  }

  // Guard: never mint a key for a mode the caller is not allowed to write to.
  const requested = validateMode(body?.mode);
  if (requested && requested !== mode) {
    return NextResponse.json(
      { error: `Cannot create a ${requested} key while the request is scoped to ${mode}.` },
      { status: 400 }
    );
  }

  try {
    const result = await createHyperApiKey(mode, name, description);
    if (result.error) {
      return NextResponse.json(result, { status: 400, headers: { "X-OpenPay-Mode": mode } });
    }
    return NextResponse.json(result, { headers: { "X-OpenPay-Mode": mode } });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create API key" },
      { status: 500, headers: { "X-OpenPay-Mode": mode } }
    );
  }
}
