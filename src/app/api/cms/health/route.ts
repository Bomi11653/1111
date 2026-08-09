import { NextResponse } from "next/server";
import { runHealthCheck } from "@/lib/cms-health";

export const dynamic = "force-dynamic";

export async function GET() {
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
