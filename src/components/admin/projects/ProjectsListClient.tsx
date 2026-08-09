"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ExternalLink, Plus } from "lucide-react";
import { ProjectPreview } from "@/components/admin/previews/ProjectPreview";
import { AdminShell, AdminStatus } from "@/components/admin/AdminShell";
import {
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminConfirmDialog,
  AdminEmpty,
  AdminInput,
  AdminLoading,
  AdminSelect,
  AdminTable,
  AdminToolbar,
  cn,
} from "@/components/admin/ui";
import type { CmsProject } from "@/lib/project-types";

type LoadState = "loading" | "ready" | "error";

export function ProjectsListClient() {
  const [projects, setProjects] = useState<CmsProject[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState("");
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("全部");
  const [status, setStatus] = useState("全部");
  const [deleteTarget, setDeleteTarget] = useState<CmsProject | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadState("loading");
    setLoadError("");
    try {
      const res = await fetch("/api/cms/projects");
      const body = await res.json();
      if (!res.ok || !body.ok) throw new Error(body.error ?? "加载失败");
      const data = body.data as CmsProject[];
      setProjects(data);
      setSelectedId((prev) => prev ?? data[0]?.id ?? null);
      setLoadState("ready");
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "加载失败");
      setLoadState("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category).filter(Boolean));
    return ["全部", ...Array.from(set)];
  }, [projects]);

  const filtered = useMemo(() => {
    return projects
      .filter((p) => {
        const q = search.trim().toLowerCase();
        const matchSearch =
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q));
        const matchCat = category === "全部" || p.category === category;
        const matchStatus =
          status === "全部" ||
          (status === "已发布" && p.published) ||
          (status === "草稿" && !p.published);
        return matchSearch && matchCat && matchStatus;
      })
      .sort((a, b) => a.order - b.order);
  }, [projects, search, category, status]);

  const selected = filtered.find((p) => p.id === selectedId) ?? filtered[0] ?? null;

  const patchProject = async (id: string, patch: Partial<CmsProject>) => {
    setSaving(true);
    setActionError("");
    try {
      const res = await fetch(`/api/cms/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) throw new Error(body.error ?? "更新失败");
      setProjects((prev) => prev.map((p) => (p.id === id ? body.data : p)));
      setMessage("已更新");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "更新失败");
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    setActionError("");
    try {
      const res = await fetch(`/api/cms/projects/${deleteTarget.id}`, { method: "DELETE" });
      const body = await res.json();
      if (!res.ok || !body.ok) throw new Error(body.error ?? "删除失败");
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      if (selectedId === deleteTarget.id) setSelectedId(null);
      setMessage("项目已删除");
      setDeleteTarget(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "删除失败");
    } finally {
      setSaving(false);
    }
  };

  const duplicateProject = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/cms/projects/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "duplicate" }),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) throw new Error(body.error ?? "复制失败");
      setProjects((prev) => [...prev, body.data as CmsProject]);
      setMessage("已创建副本");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "复制失败");
    } finally {
      setSaving(false);
    }
  };

  const moveOrder = async (project: CmsProject, dir: -1 | 1) => {
    const sorted = [...projects].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((p) => p.id === project.id);
    const swap = sorted[idx + dir];
    if (!swap) return;
    await fetch("/api/cms/projects/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [
          { id: project.id, order: swap.order },
          { id: swap.id, order: project.order },
        ],
      }),
    });
    await load();
  };

  if (loadState === "loading") {
    return (
      <AdminShell title="作品管理" description="正在加载项目列表…">
        <AdminLoading className="py-16" />
      </AdminShell>
    );
  }

  if (loadState === "error") {
    return (
      <AdminShell title="作品管理" description="加载失败">
        <AdminEmpty title="加载失败" description={loadError} action={<AdminButton onClick={load}>重试</AdminButton>} />
      </AdminShell>
    );
  }

  const detailPanel = selected ? (
    <div className="space-y-4">
      <ProjectPreview project={selected} />
      <div className="space-y-2 pt-2 border-t border-[var(--admin-border)]">
        <p className="text-[10px] text-[var(--admin-subtle)] uppercase tracking-wide">工具</p>
        <div className="flex flex-wrap gap-1">
          {selected.tools.slice(0, 5).map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 border border-[var(--admin-border)] text-[var(--admin-subtle)] rounded-full">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 pt-2">
        <Link href={`/admin/projects/${selected.id}/edit`}>
          <AdminButton variant="primary" className="w-full">
            编辑项目
          </AdminButton>
        </Link>
        <Link
          href={
            selected.published
              ? `/works/${selected.slug}`
              : `/works/${selected.slug}?preview=draft`
          }
          target="_blank"
        >
          <AdminButton variant="outline" className="w-full">
            <ExternalLink className="h-3.5 w-3.5" />
            {selected.published ? "预览前台" : "预览草稿"}
          </AdminButton>
        </Link>
      </div>
    </div>
  ) : (
    <p className="text-sm text-[var(--admin-subtle)]">选择左侧项目查看详情</p>
  );

  return (
    <AdminShell
      title="作品管理"
      description="管理你的项目案例、封面、分类和发布状态。"
      actions={
        <Link href="/admin/projects/new">
          <AdminButton variant="primary">
            <Plus className="h-4 w-4" />
            新建作品
          </AdminButton>
        </Link>
      }
      preview={detailPanel}
      previewTitle="作品详情"
    >
      <AdminToolbar>
        <AdminInput
          className="max-w-xs"
          placeholder="搜索标题 / slug / 标签"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AdminSelect className="max-w-[140px]" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </AdminSelect>
        <AdminSelect className="max-w-[140px]" value={status} onChange={(e) => setStatus(e.target.value)}>
          {["全部", "已发布", "草稿"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </AdminSelect>
      </AdminToolbar>

      <div className="hidden md:block">
        <AdminTable
        data={filtered}
        rowKey={(p) => p.id}
        empty={
          <AdminEmpty
            title="暂无项目"
            description="点击右上角「新建作品」开始创建。"
            action={
              <Link href="/admin/projects/new">
                <AdminButton variant="outline">新建作品</AdminButton>
              </Link>
            }
          />
        }
        columns={[
          {
            key: "cover",
            header: "封面",
            cell: (p) => (
              <button type="button" onClick={() => setSelectedId(p.id)} className="block">
                <div className="relative w-14 h-10 rounded overflow-hidden bg-[var(--admin-panel-soft)]">
                  <Image src={p.coverImage} alt={p.title} fill className="object-cover" unoptimized />
                </div>
              </button>
            ),
          },
          {
            key: "title",
            header: "项目",
            cell: (p) => (
              <button
                type="button"
                onClick={() => setSelectedId(p.id)}
                className={cn("text-left w-full", selected?.id === p.id && "text-[var(--admin-text)]")}
              >
                <p className="text-[var(--admin-text)]">{p.title}</p>
                <p className="text-xs text-[var(--admin-subtle)]">{p.slug}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {p.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-1.5 py-0.5 border border-[var(--admin-border)] text-[var(--admin-subtle)] rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </button>
            ),
          },
          {
            key: "category",
            header: "分类",
            cell: (p) => <span className="text-[var(--admin-muted)]">{p.category}</span>,
          },
          {
            key: "featured",
            header: "精选",
            cell: (p) => (
              <button type="button" disabled={saving} onClick={() => patchProject(p.id, { featured: !p.featured })}>
                <AdminBadge variant={p.featured ? "featured" : "neutral"}>
                  {p.featured ? "精选" : "普通"}
                </AdminBadge>
              </button>
            ),
          },
          {
            key: "status",
            header: "状态",
            cell: (p) => (
              <button type="button" disabled={saving} onClick={() => patchProject(p.id, { published: !p.published })}>
                <AdminBadge variant={p.published ? "published" : "draft"}>
                  {p.published ? "已发布" : "草稿"}
                </AdminBadge>
              </button>
            ),
          },
          {
            key: "updated",
            header: "更新",
            cell: (p) => (
              <span className="text-xs text-[var(--admin-subtle)]">
                {new Date(p.updatedAt).toLocaleDateString("zh-CN")}
              </span>
            ),
          },
          {
            key: "actions",
            header: "操作",
            className: "text-right",
            cell: (p) => (
              <div className="flex flex-wrap justify-end gap-1">
                <Link href={`/admin/projects/${p.id}/edit`}>
                  <AdminButton variant="ghost" size="sm">
                    编辑
                  </AdminButton>
                </Link>
                <AdminButton variant="ghost" size="sm" onClick={() => duplicateProject(p.id)}>
                  复制
                </AdminButton>
                <AdminButton variant="ghost" size="sm" onClick={() => moveOrder(p, -1)}>
                  ↑
                </AdminButton>
                <AdminButton variant="ghost" size="sm" onClick={() => moveOrder(p, 1)}>
                  ↓
                </AdminButton>
                <AdminButton variant="danger" size="sm" onClick={() => setDeleteTarget(p)}>
                  删除
                </AdminButton>
              </div>
            ),
          },
        ]}
        />
      </div>

      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <AdminEmpty title="暂无项目" description="点击右上角「新建作品」开始创建。" />
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              className={cn(
                "rounded-[var(--admin-radius)] border border-[var(--admin-border)] p-4 space-y-3",
                selected?.id === p.id && "border-[var(--admin-border-strong)] bg-white/[0.02]",
              )}
              onClick={() => setSelectedId(p.id)}
              onKeyDown={(e) => e.key === "Enter" && setSelectedId(p.id)}
              role="button"
              tabIndex={0}
            >
              <div className="flex gap-3">
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded bg-[var(--admin-panel-soft)]">
                  <Image src={p.coverImage} alt={p.title} fill className="object-cover" unoptimized />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--admin-text)]">{p.title}</p>
                  <p className="text-xs text-[var(--admin-subtle)]">{p.slug}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <AdminBadge variant={p.published ? "published" : "draft"}>
                      {p.published ? "已发布" : "草稿"}
                    </AdminBadge>
                    {p.featured ? <AdminBadge variant="featured">精选</AdminBadge> : null}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/admin/projects/${p.id}/edit`} onClick={(e) => e.stopPropagation()}>
                  <AdminButton variant="outline" size="sm">编辑</AdminButton>
                </Link>
                <AdminButton variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); duplicateProject(p.id); }}>
                  复制
                </AdminButton>
                <AdminButton variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); setDeleteTarget(p); }}>
                  删除
                </AdminButton>
              </div>
            </div>
          ))
        )}
      </div>

      <AdminStatus message={message} error={actionError} />

      <AdminConfirmDialog
        open={!!deleteTarget}
        title="删除项目"
        description={deleteTarget ? `确定删除「${deleteTarget.title}」？此操作不可撤销。` : undefined}
        confirmLabel="删除"
        loading={saving}
        onConfirm={deleteProject}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminShell>
  );
}
