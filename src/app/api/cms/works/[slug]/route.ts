import { blockCmsRequestInProduction } from "@/lib/local-cms";
import { NextResponse } from "next/server";
import {
  deleteWorkBySlug,
  getWorkBySlug,
  getWorkBySlugForPreview,
  upsertWorkFromCatalog,
  worksApiDeprecationHeaders,
} from "@/lib/cms";
import type { WorkCatalogEntry } from "@/lib/cms-types";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

const deprecated = { headers: worksApiDeprecationHeaders() };

/** @deprecated 请使用 GET /api/cms/projects/[id] */
export async function GET(_request: Request, { params }: Params) {
  const blocked = blockCmsRequestInProduction();
  if (blocked) return blocked;

  const { slug } = await params;
  const work = getWorkBySlug(slug) ?? getWorkBySlugForPreview(slug);
  if (!work) {
    return NextResponse.json(
      { ok: false, error: "作品不存在" },
      { status: 404, ...deprecated },
    );
  }
  return NextResponse.json(work, deprecated);
}

/** @deprecated 请使用 PUT /api/cms/projects/[id] */
export async function PUT(request: Request, { params }: Params) {
  const blocked = blockCmsRequestInProduction();
  if (blocked) return blocked;

  try {
    const { slug } = await params;
    const body = (await request.json()) as WorkCatalogEntry;
    if (body.slug !== slug) {
      return NextResponse.json(
        { ok: false, error: "slug 不匹配" },
        { status: 400, ...deprecated },
      );
    }
    upsertWorkFromCatalog(body);
    return NextResponse.json(
      { ok: true, data: getWorkBySlugForPreview(slug), deprecated: true },
      deprecated,
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "更新失败" },
      { status: 400, ...deprecated },
    );
  }
}

/** @deprecated 请使用 DELETE /api/cms/projects/[id] */
export async function DELETE(_request: Request, { params }: Params) {
  const blocked = blockCmsRequestInProduction();
  if (blocked) return blocked;

  const { slug } = await params;
  const removed = deleteWorkBySlug(slug);
  if (!removed) {
    return NextResponse.json(
      { ok: false, error: "作品不存在" },
      { status: 404, ...deprecated },
    );
  }
  return NextResponse.json({ ok: true, deprecated: true }, deprecated);
}
