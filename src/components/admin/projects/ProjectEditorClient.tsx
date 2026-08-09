"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  AdminField,
  AdminSaveButton,
  AdminShell,
  AdminStatus,
} from "@/components/admin/AdminShell";
import { ProjectPreview } from "@/components/admin/previews/ProjectPreview";
import {
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminConfirmDialog,
  AdminInput,
  AdminLoading,
  AdminSwitch,
  AdminTextarea,
  cn,
} from "@/components/admin/ui";
import type { CmsProject, CmsProjectSection } from "@/lib/project-types";
import { generateMediaId, generateSectionId } from "@/lib/projectAdapter";

type Props = { projectId?: string };

type LoadState = "loading" | "ready" | "error";

const emptyProject = (): CmsProject => ({
  id: "",
  slug: "",
  title: "",
  subtitle: "",
  category: "未分类",
  tags: [],
  year: new Date().getFullYear().toString(),
  role: "",
  tools: [],
  coverImage: "/works/placeholder.svg",
  summary: "",
  description: "",
  sections: [],
  gallery: [],
  videos: [],
  featured: false,
  published: false,
  pinned: false,
  order: 1,
  seo: { title: "", description: "", ogImage: "" },
  createdAt: "",
  updatedAt: "",
  hueOffset: 0,
  speed: 1,
});

type SectionKey = "section-basic" | "section-intro" | "section-gallery" | "section-sections" | "section-seo";

const SECTION_NAV: { id: SectionKey; label: string }[] = [
  { id: "section-basic", label: "基础信息" },
  { id: "section-intro", label: "项目介绍" },
  { id: "section-gallery", label: "图片画廊" },
  { id: "section-sections", label: "项目过程" },
  { id: "section-seo", label: "SEO 设置" },
];

export function ProjectEditorClient({ projectId }: Props) {
  const router = useRouter();
  const isNew = !projectId;
  const [project, setProject] = useState<CmsProject>(emptyProject());
  const [loadState, setLoadState] = useState<LoadState>(isNew ? "ready" : "loading");
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState<SectionKey>("section-basic");
  const [deleteImageTarget, setDeleteImageTarget] = useState<string | null>(null);
  const [deleteSectionTarget, setDeleteSectionTarget] = useState<string | null>(null);
  const [deleteProjectOpen, setDeleteProjectOpen] = useState(false);
  const [mediaUsage, setMediaUsage] = useState<Record<string, string[]>>({});

  const scrollToSection = (id: SectionKey) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const load = useCallback(async () => {
    if (!projectId) return;
    setLoadState("loading");
    try {
      const res = await fetch(`/api/cms/projects/${projectId}`);
      const body = await res.json();
      if (!res.ok || !body.ok) throw new Error(body.error ?? "加载失败");
      setProject(body.data as CmsProject);
      setLoadState("ready");
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "加载失败");
      setLoadState("error");
    }
  }, [projectId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const save = async (options?: { publish?: boolean }) => {
    setSaving(true);
    setMessage("");
    setError("");
    const payload = {
      ...project,
      published: options?.publish !== undefined ? options.publish : project.published,
    };
    try {
      const url = isNew ? "/api/cms/projects" : `/api/cms/projects/${project.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) throw new Error(body.error ?? "保存失败");
      setProject(body.data as CmsProject);
      setMessage(options?.publish ? "已发布" : options?.publish === false ? "草稿已保存" : "已保存");
      if (isNew) router.push(`/admin/projects/${body.data.id}/edit`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async () => {
    if (!project.id) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/cms/projects/${project.id}`, { method: "DELETE" });
      const body = await res.json();
      if (!res.ok || !body.ok) throw new Error(body.error ?? "删除失败");
      router.push("/admin/projects");
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除失败");
      setSaving(false);
      setDeleteProjectOpen(false);
    }
  };

  const fetchMediaUsage = async (url: string) => {
    if (mediaUsage[url]) return;
    try {
      const res = await fetch(`/api/cms/media?url=${encodeURIComponent(url)}`);
      const body = await res.json();
      if (body.ok) {
        setMediaUsage((prev) => ({ ...prev, [url]: body.data.usedIn as string[] }));
      }
    } catch {
      // ignore
    }
  };

  const replaceImage = async (mediaId: string, file: File) => {
    const target = project.gallery.find((g) => g.id === mediaId);
    if (!target || !target.url.startsWith("/uploads/")) {
      setError("仅可替换 /uploads 下的图片");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("url", target.url);
      const res = await fetch("/api/cms/media", { method: "PUT", body: fd });
      const body = await res.json();
      if (!res.ok || !body.ok) throw new Error(body.error ?? "替换失败");
      setMessage("图片已替换");
    } catch (err) {
      setError(err instanceof Error ? err.message : "替换失败");
    } finally {
      setUploading(false);
    }
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("projectId", project.id || project.slug || "new");
      const res = await fetch("/api/cms/upload", { method: "POST", body: fd });
      const body = await res.json();
      if (!res.ok || !body.ok) throw new Error(body.error ?? "上传失败");
      const item = {
        id: generateMediaId(),
        url: body.data.url,
        type: "image" as const,
        title: file.name,
        alt: file.name,
        order: project.gallery.length,
        isCover: project.gallery.length === 0,
      };
      const gallery = [...project.gallery, item];
      setProject({
        ...project,
        gallery,
        coverImage: project.coverImage === "/works/placeholder.svg" ? body.data.url : project.coverImage,
      });
      setMessage("图片已上传");
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败");
    } finally {
      setUploading(false);
    }
  };

  const setCover = (mediaId: string) => {
    const target = project.gallery.find((g) => g.id === mediaId);
    if (!target) return;
    setProject({
      ...project,
      coverImage: target.url,
      gallery: project.gallery.map((g) => ({ ...g, isCover: g.id === mediaId })),
      seo: { ...project.seo, ogImage: target.url },
    });
  };

  const addSection = (type: CmsProjectSection["type"]) => {
    const section: CmsProjectSection = {
      id: generateSectionId(),
      type,
      title: "新章节",
      content: type === "text" ? "" : undefined,
      image: type === "image" ? "" : undefined,
      videoUrl: type === "video" ? "" : undefined,
      order: project.sections.length + 1,
      enabled: true,
    };
    setProject({ ...project, sections: [...project.sections, section] });
  };

  if (loadState === "loading") {
    return (
      <AdminShell title="编辑项目" description="正在加载…">
        <AdminLoading className="py-16" />
      </AdminShell>
    );
  }

  if (loadState === "error") {
    return (
      <AdminShell title="编辑项目" description="加载失败">
        <p className="text-red-300 text-sm">{loadError}</p>
        <Link href="/admin/projects" className="mt-4 inline-block">
          <AdminButton variant="ghost">返回列表</AdminButton>
        </Link>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title={isNew ? "新建作品" : `编辑：${project.title}`}
      description="编辑项目基础信息、封面、画廊、章节与 SEO。"
      actions={
        <div className="flex flex-wrap gap-2 justify-end">
          <Link href="/admin/projects">
            <AdminButton variant="outline">返回列表</AdminButton>
          </Link>
          {!isNew && project.slug ? (
            <Link
              href={
                project.published
                  ? `/works/${project.slug}`
                  : `/works/${project.slug}?preview=draft`
              }
              target="_blank"
            >
              <AdminButton variant="ghost">
                {project.published ? "预览" : "预览草稿"}
              </AdminButton>
            </Link>
          ) : null}
          {!isNew ? (
            <AdminButton variant="danger" onClick={() => setDeleteProjectOpen(true)}>
              删除
            </AdminButton>
          ) : null}
          <AdminSaveButton
            saving={saving}
            onClick={() => save({ publish: false })}
            label={isNew ? "创建草稿" : "保存草稿"}
          />
          <AdminSaveButton
            saving={saving}
            onClick={() => save({ publish: true })}
            label="发布"
          />
        </div>
      }
      rail={
        <nav className="admin-section-nav">
          <p className="text-[10px] text-[var(--admin-subtle)] uppercase tracking-widest px-3 mb-3">
            作品结构
          </p>
          {SECTION_NAV.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollToSection(s.id)}
              className={cn(
                "admin-section-nav-item",
                activeSection === s.id && "admin-section-nav-item--active",
              )}
            >
              {s.label}
            </button>
          ))}
        </nav>
      }
      preview={
        <div className="space-y-5">
          <ProjectPreview project={project} />
          <div className="border-t border-[var(--admin-border)] pt-4 space-y-3">
            <p className="text-[10px] text-[var(--admin-subtle)] uppercase tracking-wide">发布设置</p>
            <AdminSwitch
              checked={project.published}
              onChange={(v) => setProject({ ...project, published: v })}
              label="已发布"
            />
            <AdminSwitch
              checked={project.featured}
              onChange={(v) => setProject({ ...project, featured: v })}
              label="首页精选"
            />
            <AdminSwitch
              checked={project.pinned}
              onChange={(v) => setProject({ ...project, pinned: v })}
              label="置顶"
            />
            <AdminField label="排序">
              <AdminInput
                type="number"
                value={project.order}
                onChange={(e) => setProject({ ...project, order: Number(e.target.value) || 0 })}
              />
            </AdminField>
            <div className="flex flex-wrap gap-1">
              <AdminBadge variant={project.published ? "published" : "draft"}>
                {project.published ? "已发布" : "草稿"}
              </AdminBadge>
              {project.featured ? <AdminBadge variant="featured">精选</AdminBadge> : null}
            </div>
          </div>
        </div>
      }
      previewTitle="作品预览"
    >
      <div className="max-w-2xl space-y-6">
        <div id="section-basic" className="scroll-mt-6">
          <AdminCard title="基础信息">
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="项目标题">
                <AdminInput value={project.title} onChange={(e) => setProject({ ...project, title: e.target.value })} />
              </AdminField>
              <AdminField label="Slug（路由）">
                <AdminInput value={project.slug} onChange={(e) => setProject({ ...project, slug: e.target.value })} disabled={!isNew} />
              </AdminField>
              <AdminField label="副标题">
                <AdminInput value={project.subtitle} onChange={(e) => setProject({ ...project, subtitle: e.target.value })} />
              </AdminField>
              <AdminField label="分类">
                <AdminInput value={project.category} onChange={(e) => setProject({ ...project, category: e.target.value })} />
              </AdminField>
              <AdminField label="年份">
                <AdminInput value={project.year} onChange={(e) => setProject({ ...project, year: e.target.value })} />
              </AdminField>
              <AdminField label="角色">
                <AdminInput value={project.role} onChange={(e) => setProject({ ...project, role: e.target.value })} />
              </AdminField>
            </div>
            <div className="mt-4 space-y-4">
              <AdminField label="标签（逗号分隔）">
                <AdminInput
                  value={project.tags.join(", ")}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                    })
                  }
                />
              </AdminField>
              <AdminField label="工具（逗号分隔）">
                <AdminInput
                  value={project.tools.join(", ")}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      tools: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                    })
                  }
                />
              </AdminField>
            </div>
          </AdminCard>
        </div>

        <div id="section-intro" className="scroll-mt-6">
          <AdminCard title="项目介绍">
            <AdminField label="项目简介">
              <AdminTextarea className="min-h-20" value={project.summary} onChange={(e) => setProject({ ...project, summary: e.target.value })} />
            </AdminField>
            <div className="mt-4">
              <AdminField label="完整介绍">
                <AdminTextarea className="min-h-32" value={project.description} onChange={(e) => setProject({ ...project, description: e.target.value })} />
              </AdminField>
            </div>
          </AdminCard>
        </div>

        <div id="section-gallery" className="scroll-mt-6">
          <AdminCard
            title="图片画廊"
            description="上传图片、调整顺序、设置封面"
            actions={
              <label className="text-xs text-[var(--admin-muted)] hover:text-[var(--admin-text)] cursor-pointer transition-colors">
                {uploading ? "上传中…" : "+ 上传图片"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadImage(f);
                  }}
                />
              </label>
            }
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {project.gallery.map((g, gi) => (
                <div key={g.id} className="rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] p-2 space-y-2">
                  <div className="relative aspect-video bg-[var(--admin-panel-soft)] rounded overflow-hidden">
                    <Image src={g.url} alt={g.alt} fill className="object-cover" unoptimized />
                  </div>
                  <AdminInput
                    className="text-xs"
                    value={g.title}
                    onChange={(e) =>
                      setProject({
                        ...project,
                        gallery: project.gallery.map((x) => (x.id === g.id ? { ...x, title: e.target.value } : x)),
                      })
                    }
                  />
                  <AdminInput
                    className="text-xs"
                    placeholder="alt"
                    value={g.alt}
                    onChange={(e) =>
                      setProject({
                        ...project,
                        gallery: project.gallery.map((x) => (x.id === g.id ? { ...x, alt: e.target.value } : x)),
                      })
                    }
                  />
                  <div className="flex flex-wrap gap-1">
                    <AdminButton variant="ghost" size="sm" onClick={() => setCover(g.id)}>
                      {g.isCover ? "封面" : "设为封面"}
                    </AdminButton>
                    <AdminButton
                      variant="ghost"
                      size="sm"
                      disabled={gi === 0}
                      onClick={() => {
                        const gallery = [...project.gallery];
                        [gallery[gi - 1], gallery[gi]] = [gallery[gi], gallery[gi - 1]];
                        setProject({ ...project, gallery: gallery.map((x, i) => ({ ...x, order: i })) });
                      }}
                    >
                      ↑
                    </AdminButton>
                    <AdminButton
                      variant="ghost"
                      size="sm"
                      disabled={gi === project.gallery.length - 1}
                      onClick={() => {
                        const gallery = [...project.gallery];
                        [gallery[gi], gallery[gi + 1]] = [gallery[gi + 1], gallery[gi]];
                        setProject({ ...project, gallery: gallery.map((x, i) => ({ ...x, order: i })) });
                      }}
                    >
                      ↓
                    </AdminButton>
                    <AdminButton
                      variant="danger"
                      size="sm"
                      onClick={() => setDeleteImageTarget(g.id)}
                    >
                      删除
                    </AdminButton>
                    {g.url.startsWith("/uploads/") ? (
                      <label className="text-xs text-[var(--admin-muted)] hover:text-[var(--admin-text)] cursor-pointer">
                        替换
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) replaceImage(g.id, f);
                          }}
                        />
                      </label>
                    ) : null}
                    <AdminButton
                      variant="ghost"
                      size="sm"
                      onClick={() => fetchMediaUsage(g.url)}
                    >
                      使用位置
                    </AdminButton>
                  </div>
                  {mediaUsage[g.url]?.length ? (
                    <p className="text-[10px] text-[var(--admin-subtle)]">
                      {mediaUsage[g.url].join(" · ")}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </AdminCard>
        </div>

        <div id="section-sections" className="scroll-mt-6">
          <AdminCard
            title="项目过程"
            actions={
              <div className="flex gap-1">
                <AdminButton variant="outline" size="sm" onClick={() => addSection("text")}>+ 文本</AdminButton>
                <AdminButton variant="outline" size="sm" onClick={() => addSection("image")}>+ 图片</AdminButton>
                <AdminButton variant="outline" size="sm" onClick={() => addSection("video")}>+ 视频</AdminButton>
              </div>
            }
          >
            {project.sections.map((s, i) => (
              <div key={s.id} className="border border-[var(--admin-border)] rounded-[var(--admin-radius-sm)] p-4 space-y-2 mb-3 last:mb-0">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--admin-subtle)]">章节 {i + 1} · {s.type}</span>
                  <AdminSwitch
                    checked={s.enabled}
                    onChange={(enabled) => {
                      const sections = [...project.sections];
                      sections[i] = { ...s, enabled };
                      setProject({ ...project, sections });
                    }}
                    label="显示"
                  />
                </div>
                <AdminInput value={s.title} onChange={(e) => {
                  const sections = [...project.sections];
                  sections[i] = { ...s, title: e.target.value };
                  setProject({ ...project, sections });
                }} />
                {s.type === "text" ? (
                  <AdminTextarea className="min-h-24" value={s.content ?? ""} onChange={(e) => {
                    const sections = [...project.sections];
                    sections[i] = { ...s, content: e.target.value };
                    setProject({ ...project, sections });
                  }} />
                ) : null}
                {s.type === "image" ? (
                  <AdminInput placeholder="图片 URL" value={s.image ?? ""} onChange={(e) => {
                    const sections = [...project.sections];
                    sections[i] = { ...s, image: e.target.value };
                    setProject({ ...project, sections });
                  }} />
                ) : null}
                {s.type === "video" ? (
                  <AdminInput placeholder="视频链接" value={s.videoUrl ?? ""} onChange={(e) => {
                    const sections = [...project.sections];
                    sections[i] = { ...s, videoUrl: e.target.value };
                    setProject({ ...project, sections });
                  }} />
                ) : null}
                <AdminButton variant="danger" size="sm" onClick={() => setDeleteSectionTarget(s.id)}>
                  删除章节
                </AdminButton>
              </div>
            ))}
          </AdminCard>
        </div>

        <div id="section-seo" className="scroll-mt-6">
          <AdminCard title="SEO">
            <div className="space-y-4">
              <AdminField label="SEO 标题">
                <AdminInput value={project.seo.title} onChange={(e) => setProject({ ...project, seo: { ...project.seo, title: e.target.value } })} />
              </AdminField>
              <AdminField label="SEO 描述">
                <AdminTextarea className="min-h-20" value={project.seo.description} onChange={(e) => setProject({ ...project, seo: { ...project.seo, description: e.target.value } })} />
              </AdminField>
              <AdminField label="分享图 (OG)">
                <AdminInput
                  value={project.seo.ogImage}
                  onChange={(e) => setProject({ ...project, seo: { ...project.seo, ogImage: e.target.value } })}
                  placeholder="/uploads/... 或留空使用封面"
                />
              </AdminField>
              {project.seo.ogImage ? (
                <div className="relative aspect-[1.91/1] max-w-xs rounded overflow-hidden border border-[var(--admin-border)]">
                  <Image src={project.seo.ogImage} alt="OG" fill className="object-cover" unoptimized />
                </div>
              ) : null}
            </div>
          </AdminCard>
        </div>
      </div>

      <AdminStatus message={message} error={error} />

      <AdminConfirmDialog
        open={Boolean(deleteImageTarget)}
        title="删除图片"
        description="确定从画廊中移除此图片？保存项目后生效。"
        confirmLabel="删除"
        loading={saving}
        onConfirm={() => {
          if (deleteImageTarget) {
            setProject({
              ...project,
              gallery: project.gallery.filter((x) => x.id !== deleteImageTarget),
            });
          }
          setDeleteImageTarget(null);
        }}
        onCancel={() => setDeleteImageTarget(null)}
      />

      <AdminConfirmDialog
        open={Boolean(deleteSectionTarget)}
        title="删除章节"
        description="确定删除此章节？保存项目后生效。"
        confirmLabel="删除"
        onConfirm={() => {
          if (deleteSectionTarget) {
            setProject({
              ...project,
              sections: project.sections.filter((x) => x.id !== deleteSectionTarget),
            });
          }
          setDeleteSectionTarget(null);
        }}
        onCancel={() => setDeleteSectionTarget(null)}
      />

      <AdminConfirmDialog
        open={deleteProjectOpen}
        title="删除项目"
        description={`确定永久删除「${project.title}」？此操作不可撤销。`}
        confirmLabel="删除"
        loading={saving}
        onConfirm={deleteProject}
        onCancel={() => setDeleteProjectOpen(false)}
      />
    </AdminShell>
  );
}
