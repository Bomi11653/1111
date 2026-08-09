import { NextResponse } from "next/server";
import {
  getProjectBySlugFromStore,
  getWorksCatalogContent,
  upsertWorkFromCatalog,
  worksApiDeprecationHeaders,
} from "@/lib/cms";
import type { WorkCatalogEntry, WorksContent } from "@/lib/cms-types";

export const dynamic = "force-dynamic";

const deprecated = { headers: worksApiDeprecationHeaders() };

export async function GET() {
  try {
    return NextResponse.json(getWorksCatalogContent(), deprecated);
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "读取失败" },
      { status: 500, ...deprecated },
    );
  }
}

/** @deprecated 请使用 PUT /api/cms/projects/[id] */
export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as WorksContent;
    for (const work of body.works ?? []) {
      upsertWorkFromCatalog(work);
    }
    return NextResponse.json(
      { ok: true, data: getWorksCatalogContent(), deprecated: true },
      deprecated,
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "保存失败" },
      { status: 400, ...deprecated },
    );
  }
}

/** @deprecated 请使用 POST /api/cms/projects */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as WorkCatalogEntry;
    if (!body.slug?.trim()) {
      return NextResponse.json(
        { ok: false, error: "slug 不能为空" },
        { status: 400, ...deprecated },
      );
    }
    const existing = getProjectBySlugFromStore(body.slug);
    if (existing) {
      return NextResponse.json(
        { ok: false, error: "slug 已存在" },
        { status: 409, ...deprecated },
      );
    }
    const project = upsertWorkFromCatalog(body);
    return NextResponse.json(
      {
        ok: true,
        data: getWorksCatalogContent().works.find((w) => w.slug === project.slug),
        deprecated: true,
      },
      deprecated,
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "创建失败" },
      { status: 400, ...deprecated },
    );
  }
}
