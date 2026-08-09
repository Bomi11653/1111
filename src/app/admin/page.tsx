"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, FolderKanban, ImageIcon, LayoutGrid, Plus } from "lucide-react";
import { AdminBackupsPanel } from "@/components/admin/dashboard/AdminBackupsPanel";
import { AdminHealthCheck } from "@/components/admin/dashboard/AdminHealthCheck";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminEmpty,
  AdminLoading,
} from "@/components/admin/ui";
import type { CmsProject } from "@/lib/project-types";

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<CmsProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/cms/projects")
      .then((res) => res.json())
      .then((body) => {
        if (!body.ok) throw new Error(body.error ?? "加载失败");
        setProjects(body.data as CmsProject[]);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "加载失败"))
      .finally(() => setLoading(false));
  }, []);

  const published = projects.filter((p) => p.published).length;
  const drafts = projects.filter((p) => !p.published).length;
  const featured = projects.filter((p) => p.featured && p.published).length;
  const recent = [...projects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <AdminShell title="仪表盘" description="作品集 CMS 总览">
        <AdminLoading className="py-16" label="正在加载数据…" />
      </AdminShell>
    );
  }

  if (error) {
    return (
      <AdminShell title="仪表盘" description="作品集 CMS 总览">
        <AdminEmpty title="加载失败" description={error} />
      </AdminShell>
    );
  }

  const stats = [
    { label: "全部项目", value: projects.length },
    { label: "已发布", value: published },
    { label: "草稿", value: drafts },
    { label: "首页精选", value: featured },
  ];

  return (
    <AdminShell
      title="仪表盘"
      description="查看项目概况、发布状态与快捷操作。"
      actions={
        <Link href="/admin/projects/new">
          <AdminButton variant="primary">
            <Plus className="h-4 w-4" />
            新建项目
          </AdminButton>
        </Link>
      }
    >
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <AdminCard key={s.label} padding="sm" className="hover:bg-white/[0.02]">
              <p className="text-xs text-[var(--admin-subtle)] uppercase tracking-wide">{s.label}</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums text-[var(--admin-text)]">
                {s.value}
              </p>
            </AdminCard>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <AdminHealthCheck />
          <AdminBackupsPanel />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <AdminCard title="最近更新" description="最近编辑的作品项目">
            {recent.length === 0 ? (
              <AdminEmpty
                title="暂无项目"
                description="创建第一个作品项目开始管理内容。"
                action={
                  <Link href="/admin/projects/new">
                    <AdminButton variant="outline">新建项目</AdminButton>
                  </Link>
                }
              />
            ) : (
              <div className="space-y-2">
                {recent.map((p) => (
                  <Link
                    key={p.id}
                    href={`/admin/projects/${p.id}/edit`}
                    className="flex items-center gap-4 rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] p-3 transition-colors hover:bg-white/[0.03] hover:border-[var(--admin-border-strong)]"
                  >
                    <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded bg-[var(--admin-panel-soft)]">
                      <Image src={p.coverImage} alt={p.title} fill className="object-cover" unoptimized />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-[var(--admin-text)] truncate">{p.title}</p>
                      <p className="text-xs text-[var(--admin-subtle)]">
                        {new Date(p.updatedAt).toLocaleDateString("zh-CN")}
                      </p>
                    </div>
                    <AdminBadge variant={p.published ? "published" : "draft"}>
                      {p.published ? "已发布" : "草稿"}
                    </AdminBadge>
                  </Link>
                ))}
              </div>
            )}
          </AdminCard>

          <AdminCard title="快捷操作">
            <div className="space-y-2">
              {[
                { href: "/admin/projects", label: "作品管理", icon: FolderKanban },
                { href: "/admin/media", label: "媒体资源", icon: ImageIcon },
                { href: "/admin/modules", label: "模块设置", icon: LayoutGrid },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] px-3 py-2.5 text-sm text-[var(--admin-muted)] transition-colors hover:text-[var(--admin-text)] hover:border-[var(--admin-border-strong)] hover:bg-white/[0.03]"
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4 opacity-60" strokeWidth={1.5} />
                      {item.label}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-40" />
                  </Link>
                );
              })}
            </div>
          </AdminCard>
        </div>
      </div>
    </AdminShell>
  );
}
