import { NextResponse } from "next/server";

export function isLocalCmsAvailable(): boolean {
  return process.env.NODE_ENV !== "production";
}

export function blockCmsRequestInProduction(): NextResponse | null {
  if (isLocalCmsAvailable()) return null;

  return NextResponse.json(
    { ok: false, error: "Not found" },
    { status: 404, headers: { "Cache-Control": "no-store" } },
  );
}
