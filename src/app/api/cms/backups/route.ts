import { blockCmsRequestInProduction } from "@/lib/local-cms";
import { NextResponse } from "next/server";
import { listBackups, restoreBackup } from "@/lib/cms-backup";

export const dynamic = "force-dynamic";

export async function GET() {
  const blocked = blockCmsRequestInProduction();
  if (blocked) return blocked;

  try {
    const backups = listBackups();
    return NextResponse.json({ ok: true, data: backups });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "读取备份失败" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const blocked = blockCmsRequestInProduction();
  if (blocked) return blocked;

  try {
    const body = (await request.json()) as { backupName?: string };
    if (!body.backupName) {
      return NextResponse.json({ ok: false, error: "缺少 backupName" }, { status: 400 });
    }
    const sourceFile = restoreBackup(body.backupName);
    return NextResponse.json({ ok: true, data: { sourceFile, backupName: body.backupName } });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "恢复失败" },
      { status: 400 },
    );
  }
}
