import { blockCmsRequestInProduction } from "@/lib/local-cms";
import { NextResponse } from "next/server";
import { runHealthCheck } from "@/lib/cms-health";

export const dynamic = "force-dynamic";

export async function GET() {
  const blocked = blockCmsRequestInProduction();
  if (blocked) return blocked;

  try {
    const report = runHealthCheck();
    return NextResponse.json({ ok: true, data: report });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "检查失败" },
      { status: 500 },
    );
  }
}
