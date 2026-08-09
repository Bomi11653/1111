import { NextResponse } from "next/server";
import { getSeoContent, saveSeoContent } from "@/lib/cms";
import type { SeoContent } from "@/lib/cms-types";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getSeoContent());
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as SeoContent;
    saveSeoContent(body);
    return NextResponse.json({ ok: true, data: getSeoContent() });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "保存失败" },
      { status: 400 },
    );
  }
}
