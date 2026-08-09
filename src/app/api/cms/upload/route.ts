import { mkdirSync, existsSync, writeFileSync } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ALLOWED = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 12 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    const projectId = (form.get("projectId") as string) || "general";

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "未找到上传文件" }, { status: 400 });
    }

    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { ok: false, error: "仅支持 jpg / jpeg / png / webp / gif" },
        { status: 400 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ ok: false, error: "文件不能超过 12MB" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads", "projects", projectId);

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
