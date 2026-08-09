import { NextResponse } from "next/server";
import { getHomeContent, saveHomeContent, type HomeContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getHomeContent());
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as HomeContent;
    saveHomeContent(body);
    return NextResponse.json({ ok: true, data: getHomeContent() });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "保存失败" },
      { status: 400 },
    );
  }
}
