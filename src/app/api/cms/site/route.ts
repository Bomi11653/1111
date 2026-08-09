import { blockCmsRequestInProduction } from "@/lib/local-cms";
import { NextResponse } from "next/server";
import { getSiteContent, saveSiteContent, type SiteContent } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function GET() {
  const blocked = blockCmsRequestInProduction();
  if (blocked) return blocked;

  return NextResponse.json(getSiteContent());
}

export async function PUT(request: Request) {
  const blocked = blockCmsRequestInProduction();
  if (blocked) return blocked;

  try {
    const body = (await request.json()) as SiteContent;
    saveSiteContent(body);
    return NextResponse.json({ ok: true, data: getSiteContent() });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "保存失败" },
      { status: 400 },
    );
  }
}
