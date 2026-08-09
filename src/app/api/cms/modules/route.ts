import { blockCmsRequestInProduction } from "@/lib/local-cms";
import { NextResponse } from "next/server";
import { getModulesContent, saveModulesContent } from "@/lib/cms";
import type { ModulesContent } from "@/lib/cms-types";

export const dynamic = "force-dynamic";

export async function GET() {
  const blocked = blockCmsRequestInProduction();
  if (blocked) return blocked;

  return NextResponse.json(getModulesContent());
}

export async function PUT(request: Request) {
  const blocked = blockCmsRequestInProduction();
  if (blocked) return blocked;

  try {
    const body = (await request.json()) as ModulesContent;
    saveModulesContent(body);
    return NextResponse.json({ ok: true, data: getModulesContent() });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "保存失败" },
      { status: 400 },
    );
  }
}
