import { blockCmsRequestInProduction } from "@/lib/local-cms";
import { NextResponse } from "next/server";
import { reorderProjectsList } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  const blocked = blockCmsRequestInProduction();
  if (blocked) return blocked;

  try {
    const body = (await request.json()) as { items: { id: string; order: number }[] };
    if (!Array.isArray(body.items)) {
      return NextResponse.json({ ok: false, error: "items 必须是数组" }, { status: 400 });
    }
    const data = reorderProjectsList(body.items);
    return NextResponse.json({ ok: true, data: data.projects });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "排序失败" },
      { status: 400 },
    );
  }
}
