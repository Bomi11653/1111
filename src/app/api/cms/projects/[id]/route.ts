import { blockCmsRequestInProduction } from "@/lib/local-cms";
import { NextResponse } from "next/server";
import {
  deleteProjectById,
  duplicateProject,
  getProjectById,
  updateProjectById,
} from "@/lib/cms";
import type { CmsProject } from "@/lib/project-types";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const blocked = blockCmsRequestInProduction();
  if (blocked) return blocked;

  try {
    const { id } = await params;
    const project = getProjectById(id);
    if (!project) {
      return NextResponse.json({ ok: false, error: "项目不存在" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, data: project });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "读取失败" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  const blocked = blockCmsRequestInProduction();
  if (blocked) return blocked;

  try {
    const { id } = await params;
    const body = (await request.json()) as Partial<CmsProject>;
    const project = updateProjectById(id, body);
    return NextResponse.json({ ok: true, data: project });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "更新失败" },
      { status: 400 },
    );
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const blocked = blockCmsRequestInProduction();
  if (blocked) return blocked;

  try {
    const { id } = await params;
    const removed = deleteProjectById(id);
    if (!removed) {
      return NextResponse.json({ ok: false, error: "项目不存在" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "删除失败" },
      { status: 400 },
    );
  }
}

export async function POST(request: Request, { params }: Params) {
  const blocked = blockCmsRequestInProduction();
  if (blocked) return blocked;

  try {
    const { id } = await params;
    const body = (await request.json()) as { action?: string };
    if (body.action === "duplicate") {
      const copy = duplicateProject(id);
      return NextResponse.json({ ok: true, data: copy });
    }
    return NextResponse.json({ ok: false, error: "未知操作" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "操作失败" },
      { status: 400 },
    );
  }
}
