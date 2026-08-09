import { blockCmsRequestInProduction } from "@/lib/local-cms";
import { existsSync, readdirSync, statSync, writeFileSync } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { deleteUploadFile, findMediaUsage, publicUrlToUploadPath } from "@/lib/media-store";

export const dynamic = "force-dynamic";

type MediaFile = {
  url: string;
  filename: string;
  size: number;
  type: string;
  uploadedAt: string;
  usedIn: string[];
};

function scanDir(dir: string, baseUrl: string): MediaFile[] {
  if (!existsSync(dir)) return [];
  const items: MediaFile[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      items.push(...scanDir(full, `${baseUrl}/${entry.name}`));
    } else if (/\.(jpe?g|png|webp|gif|pdf|mp4)$/i.test(entry.name)) {
      const stat = statSync(full);
      const ext = entry.name.split(".").pop()?.toLowerCase() ?? "";
      const type = ext === "pdf" ? "pdf" : ext === "mp4" ? "video" : "image";
      items.push({
        url: `${baseUrl}/${entry.name}`,
        filename: entry.name,
        size: stat.size,
        type,
        uploadedAt: stat.mtime.toISOString(),
        usedIn: [],
      });
    }
  }
  return items;
}

export async function GET(request: Request) {
  const blocked = blockCmsRequestInProduction();
  if (blocked) return blocked;

  try {
    const url = new URL(request.url).searchParams.get("url");
    if (url) {
      return NextResponse.json({ ok: true, data: { usedIn: findMediaUsage(url) } });
    }

    const uploadsRoot = path.join(process.cwd(), "public", "uploads");
    const worksRoot = path.join(process.cwd(), "public", "works");

    const uploadFiles = scanDir(uploadsRoot, "/uploads");
    const workFiles = scanDir(worksRoot, "/works");

    const all = [...uploadFiles, ...workFiles].map((f) => ({
      ...f,
      usedIn: findMediaUsage(f.url),
    }));

    return NextResponse.json({ ok: true, data: all });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "读取失败" },
      { status: 500 },
    );
  }
}

const ALLOWED = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 12 * 1024 * 1024;

export async function PUT(request: Request) {
  const blocked = blockCmsRequestInProduction();
  if (blocked) return blocked;

  try {
    const form = await request.formData();
    const file = form.get("file");
    const targetUrl = form.get("url") as string;

    if (!targetUrl) {
      return NextResponse.json({ ok: false, error: "缺少 url 参数" }, { status: 400 });
    }

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "未找到上传文件" }, { status: 400 });
    }

    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ ok: false, error: "仅支持 jpg / jpeg / png / webp / gif" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ ok: false, error: "文件不能超过 12MB" }, { status: 400 });
    }

    const filePath = publicUrlToUploadPath(targetUrl);
    if (!filePath || !existsSync(filePath)) {
      return NextResponse.json({ ok: false, error: "仅可替换 /uploads 下已存在的文件" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    writeFileSync(filePath, buffer);

    const stat = statSync(filePath);
    return NextResponse.json({
      ok: true,
      data: {
        url: targetUrl,
        filename: path.basename(filePath),
        size: stat.size,
        type: file.type,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "替换失败" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const blocked = blockCmsRequestInProduction();
  if (blocked) return blocked;

  try {
    const body = (await request.json()) as { url?: string; force?: boolean };
    const url = body.url;
    if (!url) {
      return NextResponse.json({ ok: false, error: "缺少 url" }, { status: 400 });
    }

    const result = deleteUploadFile(url, Boolean(body.force));
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error, usedIn: result.usedIn },
        { status: result.usedIn?.length ? 409 : 400 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "删除失败" },
      { status: 500 },
    );
  }
}
