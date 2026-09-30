import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const apiBase = process.env.API_BASE_URL?.replace(/\/+$/, "");
  if (!apiBase) {
    return NextResponse.json(
      { error: { code: "API_NOT_CONFIGURED", message: "The internal web API is not connected yet." } },
      { status: 503 },
    );
  }

  const incoming = new URL(request.url);
  const target = new URL("/api/v1/browser/resolve", apiBase);
  target.search = incoming.search;

  try {
    const upstream = await fetch(target, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    const body = await upstream.json();
    return NextResponse.json(body, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { error: { code: "API_UNAVAILABLE", message: "The internal web could not be reached. Try again shortly." } },
      { status: 502 },
    );
  }
}
