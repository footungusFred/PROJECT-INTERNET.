import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "project-internet-web",
    timestamp: new Date().toISOString(),
  });
}
