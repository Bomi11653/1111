import { blockCmsRequestInProduction } from "@/lib/local-cms";
import { NextResponse } from "next/server";
import { setProjectCoverImage } from "@/lib/cms";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const blocked = blockCmsRequestInProduction();
  if (blocked) return blocked;

  try {
    const { id } = await params;
    const body = (await request.json()) as { mediaId: string };
    if (!body.mediaId) {
      return NextResponse.json({ ok: false, error: "mediaId 必填" }, { status: 400 });
    }
    const updated = setProjectCoverImage(id, body.mediaId);
    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "设置封面失败" },
      { status: 400 },
    );
  }
}
