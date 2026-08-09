import { blockCmsRequestInProduction } from "@/lib/local-cms";
import { NextResponse } from "next/server";
import { deleteProjectMedia, getProjectById, updateProjectById } from "@/lib/cms";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string; mediaId: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  const blocked = blockCmsRequestInProduction();
  if (blocked) return blocked;

  try {
    const { id, mediaId } = await params;
    const project = getProjectById(id);
    if (!project) throw new Error("项目不存在");

    if (mediaId.startsWith("video-")) {
      const updated = updateProjectById(id, {
        videos: project.videos.filter((v) => v.id !== mediaId),
      });
      return NextResponse.json({ ok: true, data: updated });
    }

    const updated = deleteProjectMedia(id, mediaId);
    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "删除媒体失败" },
      { status: 400 },
    );
  }
}
