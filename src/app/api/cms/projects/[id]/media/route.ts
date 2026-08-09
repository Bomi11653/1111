import { NextResponse } from "next/server";
import { addProjectMedia, getProjectById, updateProjectById } from "@/lib/cms";
import { generateMediaId } from "@/lib/projectAdapter";
import type { CmsGalleryItem, CmsProjectVideo } from "@/lib/project-types";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Partial<CmsGalleryItem | CmsProjectVideo> & {
      kind?: "gallery" | "video";
    };

    const project = getProjectById(id);
    if (!project) throw new Error("项目不存在");

    if (body.kind === "video") {
      const video: CmsProjectVideo = {
        id: `video-${Date.now().toString(36)}`,
        url: body.url ?? "",
        title: (body as CmsProjectVideo).title ?? "项目视频",
        order: project.videos.length + 1,
      };
      const updated = updateProjectById(id, { videos: [...project.videos, video] });
      return NextResponse.json({ ok: true, data: updated });
    }

    const maxOrder = project.gallery.reduce((m, g) => Math.max(m, g.order), -1);
    const item: CmsGalleryItem = {
      id: body.id ?? generateMediaId(),
      url: body.url ?? "",
      type: "image",
      title: body.title ?? "展示图",
      alt: (body as CmsGalleryItem).alt ?? body.title ?? "",
      order: body.order ?? maxOrder + 1,
      isCover: false,
    };
    const updated = addProjectMedia(id, item);
    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "添加媒体失败" },
      { status: 400 },
    );
  }
}
