import { blockCmsRequestInProduction } from "@/lib/local-cms";
import { NextResponse } from "next/server";
import { reorderProjectMedia } from "@/lib/cms";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const blocked = blockCmsRequestInProduction();
  if (blocked) return blocked;

  try {
    const { id } = await params;
    const body = (await request.json()) as { items: { id: string; order: number }[] };
    if (!Array.isArray(body.items)) {
      return NextResponse.json({ ok: false, error: "items 必须是数组" }, { status: 400 });
    }
    const updated = reorderProjectMedia(id, body.items);
    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "排序失败" },
      { status: 400 },
    );
  }
}
