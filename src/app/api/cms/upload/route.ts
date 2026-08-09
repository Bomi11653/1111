import { blockCmsRequestInProduction } from "@/lib/local-cms";
import { mkdirSync, existsSync, writeFileSync } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_BYTES = 12 * 1024 * 1024;

export async function POST(request: Request) {
  const blocked = blockCmsRequestInProduction();
  if (blocked) return blocked;

  try {
    const form = await request.formData();
    const file = form.get("file");
    const projectIdRaw = String(form.get("projectId") || "general");
    const projectId = /^[a-zA-Z0-9_-]{1,80}$/.test(projectIdRaw) ? projectIdRaw : null;

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "未找到上传文件" }, { status: 400 });
    }

    const ext = EXTENSION_BY_MIME[file.type];
    if (!ext) {
      return NextResponse.json(
        { ok: false, error: "仅支持 jpg / jpeg / png / webp / gif" },
        { status: 400 },
      );
    }

    if (!projectId) {
      return NextResponse.json({ ok: false, error: "Invalid project id" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ ok: false, error: "文件不能超过 12MB" }, { status: 400 });
    }

    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const uploadsRoot = path.resolve(process.cwd(), "public", "uploads", "projects");
    const dir = path.resolve(uploadsRoot, projectId);

    if (!dir.startsWith(`${uploadsRoot}${path.sep}`)) {
      return NextResponse.json({ ok: false, error: "Invalid upload path" }, { status: 400 });
    }

    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(dir, safeName);
    writeFileSync(filePath, buffer);

    const url = `/uploads/projects/${projectId}/${safeName}`;

    return NextResponse.json({
      ok: true,
      data: { url, filename: safeName, size: file.size, type: file.type },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "上传失败" },
      { status: 500 },
    );
  }
}
