"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { AdminBadge, AdminCard, AdminEmpty, AdminLoading } from "@/components/admin/ui";
import type { HealthReport } from "@/lib/cms-types";

export function AdminHealthCheck() {
  const [report, setReport] = useState<HealthReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/cms/health")
      .then((res) => res.json())
      .then((body) => {
        if (!body.ok) throw new Error(body.error ?? "检查失败");
        setReport(body.data as HealthReport);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "检查失败"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminCard title="上线检查">
        <AdminLoading className="py-8" label="正在扫描站点…" />
      </AdminCard>
    );
  }

  if (error || !report) {
    return (
      <AdminCard title="上线检查">
        <AdminEmpty title="检查失败" description={error || "未知错误"} />
      </AdminCard>
    );
  }

  const { stats, issues } = report;
  const hasErrors = issues.some((i) => i.level === "error");

  return (
    <AdminCard
      title="上线检查"
      description={
        issues.length === 0
          ? "未发现明显问题，可以上线。"
          : `发现 ${issues.length} 项待处理${hasErrors ? "（含严重问题）" : ""}`
      }
      actions={
        issues.length === 0 ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-400/80" />
        ) : (
          <AlertTriangle className={`h-4 w-4 ${hasErrors ? "text-red-400" : "text-amber-400"}`} />
        )
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-4">
        {[
          { label: "缺少封面", value: stats.missingCover },
          { label: "草稿项目", value: stats.draftCount },
          { label: "未发布", value: stats.totalProjects - stats.publishedCount },
          { label: "失效图片", value: stats.brokenImages },
          { label: "缺少 alt", value: stats.missingAlt },
          { label: "空链接", value: stats.emptyLinks },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] px-3 py-2"
          >
            <p className="text-[10px] text-[var(--admin-subtle)] uppercase">{s.label}</p>
            <p className="text-lg font-semibold tabular-nums text-[var(--admin-text)]">{s.value}</p>
          </div>
        ))}
      </div>

      {stats.lastUpdated ? (
        <p className="text-xs text-[var(--admin-subtle)] mb-4">
          最近更新：{new Date(stats.lastUpdated).toLocaleString("zh-CN")}
        </p>
      ) : null}

      {issues.length === 0 ? (
        <p className="text-sm text-[var(--admin-muted)]">所有检查项均通过。</p>
      ) : (
        <ul className="space-y-2 max-h-48 overflow-y-auto">
          {issues.map((issue, i) => (
            <li
              key={`${issue.category}-${i}`}
              className="flex items-start justify-between gap-2 text-sm border-b border-[var(--admin-border)] pb-2 last:border-0"
            >
              <div className="min-w-0">
                <AdminBadge variant={issue.level === "error" ? "draft" : "neutral"}>
                  {issue.category}
                </AdminBadge>
                <p className="text-[var(--admin-muted)] mt-1">{issue.message}</p>
              </div>
              {issue.link ? (
                <Link
                  href={issue.link}
                  className="shrink-0 text-xs text-[var(--admin-subtle)] hover:text-[var(--admin-text)]"
                >
                  修复 →
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </AdminCard>
  );
}
