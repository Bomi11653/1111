import { blockCmsRequestInProduction } from "@/lib/local-cms";
import { NextResponse } from "next/server";
import {
  createProject,
  getAllProjects,
  getProjectsContent,
} from "@/lib/cms";
import type { CmsProject } from "@/lib/project-types";

export const dynamic = "force-dynamic";

export async function GET() {
  const blocked = blockCmsRequestInProduction();
  if (blocked) return blocked;

  try {
    return NextResponse.json({ ok: true, data: getAllProjects() });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "读取失败" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const blocked = blockCmsRequestInProduction();
  if (blocked) return blocked;

  try {
    const body = (await request.json()) as Partial<CmsProject>;
    const maxOrder = getProjectsContent().projects.reduce((m, p) => Math.max(m, p.order), 0);
    const project = createProject({
      id: body.id,
      slug: body.slug?.trim() || `project-${Date.now().toString(36)}`,
      title: body.title?.trim() || "未命名项目",
      subtitle: body.subtitle ?? "",
      category: body.category ?? "未分类",
      tags: body.tags ?? [],
      year: body.year ?? new Date().getFullYear().toString(),
      role: body.role ?? "",
      tools: body.tools ?? [],
      coverImage: body.coverImage ?? "/works/placeholder.svg",
      summary: body.summary ?? "",
      description: body.description ?? "",
      sections: body.sections ?? [],
      gallery: body.gallery ?? [],
      videos: body.videos ?? [],
      featured: body.featured ?? false,
      published: body.published ?? false,
      pinned: body.pinned ?? false,
      order: body.order ?? maxOrder + 1,
      seo: body.seo ?? { title: "", description: "", ogImage: "" },
      tagline: body.tagline,
      hueOffset: body.hueOffset ?? 0,
      speed: body.speed ?? 1,
      stagePosters: body.stagePosters ?? [],
      externalUrl: body.externalUrl,
      meta: body.meta,
    });
    return NextResponse.json({ ok: true, data: project }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "创建失败" },
      { status: 400 },
    );
  }
}
