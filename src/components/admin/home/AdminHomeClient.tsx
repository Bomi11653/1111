"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { HomePreview } from "@/components/admin/previews/HomePreview";
import {
  AdminField,
  AdminSaveButton,
  AdminShell,
  AdminStatus,
} from "@/components/admin/AdminShell";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminLoading,
  AdminModuleRow,
  AdminTextarea,
} from "@/components/admin/ui";
import type { HomeContent, ModuleConfig, ModulesContent, SiteContent } from "@/lib/cms-types";
import type { CmsProject } from "@/lib/project-types";
import { cmsFetch, cmsSave } from "@/lib/admin";

function updateHomeModule(
  modules: ModulesContent,
  index: number,
  patch: Partial<ModuleConfig>,
): ModulesContent {
  const next = [...modules.home];
  next[index] = { ...next[index], ...patch };
  return { ...modules, home: next };
}

export function AdminHomeClient() {
  const [site, setSite] = useState<SiteContent | null>(null);
  const [home, setHome] = useState<HomeContent | null>(null);
  const [modules, setModules] = useState<ModulesContent | null>(null);
  const [projects, setProjects] = useState<CmsProject[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      cmsFetch<SiteContent>("/api/cms/site"),
      cmsFetch<HomeContent>("/api/cms/home"),
      cmsFetch<ModulesContent>("/api/cms/modules"),
      fetch("/api/cms/projects")
        .then((r) => r.json())
        .then((b) => (b.ok ? (b.data as CmsProject[]) : [])),
    ])
      .then(([siteData, homeData, modulesData, projectsData]) => {
        setSite(siteData);
        setHome(homeData);
        setModules(modulesData);
        setProjects(projectsData);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "加载失败"));
  }, []);

  const featuredProjects = useMemo(() => {
    if (!home) return [];
    return home.featuredSlugs
      .map((slug) => projects.find((p) => p.slug === slug))
      .filter((p): p is CmsProject => Boolean(p));
  }, [home, projects]);

  const previewFeatured = useMemo(() => {
    if (!home) return [];
    const fromSlugs = home.featuredSlugs
      .map((slug) => projects.find((p) => p.slug === slug))
      .filter((p): p is CmsProject => Boolean(p));
    if (fromSlugs.length > 0) return fromSlugs;
    return projects.filter((p) => p.featured && p.published).slice(0, 4);
  }, [home, projects]);

  const toggleFeaturedSlug = (slug: string) => {
    if (!home) return;
    const has = home.featuredSlugs.includes(slug);
    setHome({
      ...home,
      featuredSlugs: has
        ? home.featuredSlugs.filter((s) => s !== slug)
        : [...home.featuredSlugs, slug],
    });
  };

  const uploadHeroBackground = async (file: File) => {
    if (!home) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("projectId", "hero");
      const res = await fetch("/api/cms/upload", { method: "POST", body: fd });
      const body = await res.json();
      if (!res.ok || !body.ok) throw new Error(body.error ?? "上传失败");
      setHome({ ...home, hero: { ...home.hero, backgroundImage: body.data.url } });
      setMessage("Hero 背景图已上传");
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!site || !home || !modules) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const [savedSite, savedHome, savedModules] = await Promise.all([
        cmsSave<SiteContent>("/api/cms/site", site),
        cmsSave<HomeContent>("/api/cms/home", home),
        cmsSave<ModulesContent>("/api/cms/modules", modules),
      ]);
      setSite(savedSite);
      setHome(savedHome);
      setModules(savedModules);
      setMessage("首页内容已保存，刷新前台即可看到更新。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  if (!site || !home || !modules) {
    return (
      <AdminShell title="首页管理" description="加载中…">
        <AdminLoading className="py-16" label={error || "正在读取内容配置…"} />
      </AdminShell>
    );
  }

  const sortedHomeModules = [...modules.home].sort((a, b) => a.order - b.order);

  return (
    <AdminShell
      title="首页管理"
      description="编辑首页 Hero、模块显示、精选作品与站点基础信息。"
      actions={
        <>
          <Link href="/" target="_blank">
            <AdminButton variant="outline">
              <ExternalLink className="h-3.5 w-3.5" />
              预览首页
            </AdminButton>
          </Link>
          <AdminSaveButton saving={saving} onClick={save} />
        </>
      }
      preview={<HomePreview site={site} home={home} featuredProjects={previewFeatured} />}
      previewTitle="首页实时预览"
    >
      <div className="max-w-3xl space-y-6">
        <AdminCard title="Hero 首屏设置" description="主标题、副标题、CTA 与职业标签">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="主标题（中文）">
              <AdminInput
                value={home.hero.titleZh}
                onChange={(e) => setHome({ ...home, hero: { ...home.hero, titleZh: e.target.value } })}
              />
            </AdminField>
            <AdminField label="主标题（英文）">
              <AdminInput
                value={home.hero.titleEn}
                onChange={(e) => setHome({ ...home, hero: { ...home.hero, titleEn: e.target.value } })}
              />
            </AdminField>
            <AdminField label="副标题（中文）">
              <AdminInput
                value={home.hero.subtitleZh}
                onChange={(e) => setHome({ ...home, hero: { ...home.hero, subtitleZh: e.target.value } })}
              />
            </AdminField>
            <AdminField label="职业标签（中文）">
              <AdminInput
                value={home.hero.taglineZh}
                onChange={(e) => setHome({ ...home, hero: { ...home.hero, taglineZh: e.target.value } })}
              />
            </AdminField>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <AdminField label="CTA 按钮文案">
              <AdminInput
                value={home.hero.ctaTextZh}
                onChange={(e) => setHome({ ...home, hero: { ...home.hero, ctaTextZh: e.target.value } })}
              />
            </AdminField>
            <AdminField label="CTA 跳转链接">
              <AdminInput
                value={home.hero.ctaHref}
                onChange={(e) => setHome({ ...home, hero: { ...home.hero, ctaHref: e.target.value } })}
              />
            </AdminField>
          </div>
          <div className="mt-4">
            <AdminField label="一句话介绍">
              <AdminTextarea
                className="min-h-20"
                value={home.hero.headlineZh}
                onChange={(e) => setHome({ ...home, hero: { ...home.hero, headlineZh: e.target.value } })}
              />
            </AdminField>
          </div>
          <div className="mt-6 pt-6 border-t border-[var(--admin-border)]">
            <p className="text-sm text-[var(--admin-muted)] mb-3">背景媒体</p>
            {home.hero.backgroundImage ? (
              <div className="relative aspect-video max-w-sm rounded overflow-hidden border border-[var(--admin-border)] mb-3">
                <Image
                  src={home.hero.backgroundImage}
                  alt="Hero 背景"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : null}
            <div className="flex flex-wrap gap-3 items-center">
              <label className="text-xs text-[var(--admin-muted)] hover:text-[var(--admin-text)] cursor-pointer">
                {uploading ? "上传中…" : "上传背景图"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadHeroBackground(f);
                  }}
                />
              </label>
              {home.hero.backgroundImage ? (
                <AdminButton
                  variant="danger"
                  size="sm"
                  onClick={() =>
                    setHome({ ...home, hero: { ...home.hero, backgroundImage: "" } })
                  }
                >
                  移除背景图
                </AdminButton>
              ) : null}
            </div>
            <div className="mt-4">
              <AdminField label="背景视频链接（外部 URL，可选）" hint="不直接上传视频文件，请填写外链">
                <AdminInput
                  value={home.hero.backgroundVideoUrl ?? ""}
                  onChange={(e) =>
                    setHome({
                      ...home,
                      hero: { ...home.hero, backgroundVideoUrl: e.target.value },
                    })
                  }
                  placeholder="https://..."
                />
              </AdminField>
            </div>
          </div>
        </AdminCard>

        <AdminCard title="首页模块设置" description="控制各模块显示、排序与说明">
          {sortedHomeModules.map((mod) => {
            const index = modules.home.findIndex((m) => m.id === mod.id);
            const sorted = [...modules.home].sort((a, b) => a.order - b.order);
            const pos = sorted.findIndex((m) => m.id === mod.id);
            return (
              <AdminModuleRow
                key={mod.id}
                title={mod.title}
                description={mod.description}
                enabled={mod.enabled}
                order={mod.order}
                onEnabledChange={(enabled) =>
                  setModules(updateHomeModule(modules, index, { enabled }))
                }
                onOrderChange={(order) => setModules(updateHomeModule(modules, index, { order }))}
                onMoveUp={
                  pos > 0
                    ? () => {
                        const prev = sorted[pos - 1];
                        setModules(
                          updateHomeModule(
                            updateHomeModule(modules, index, { order: prev.order }),
                            modules.home.findIndex((m) => m.id === prev.id),
                            { order: mod.order },
                          ),
                        );
                      }
                    : undefined
                }
                onMoveDown={
                  pos < sorted.length - 1
                    ? () => {
                        const next = sorted[pos + 1];
                        setModules(
                          updateHomeModule(
                            updateHomeModule(modules, index, { order: next.order }),
                            modules.home.findIndex((m) => m.id === next.id),
                            { order: mod.order },
                          ),
                        );
                      }
                    : undefined
                }
              />
            );
          })}
        </AdminCard>

        <AdminCard title="精选作品选择" description="勾选将显示在首页精选区域">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {projects
              .filter((p) => p.published)
              .sort((a, b) => a.order - b.order)
              .map((p) => {
                const selected = home.featuredSlugs.includes(p.slug);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleFeaturedSlug(p.slug)}
                    className={`admin-project-pick text-left ${selected ? "admin-project-pick--selected" : ""}`}
                  >
                    <div className="relative aspect-[4/3] bg-[var(--admin-panel-soft)]">
                      <Image src={p.coverImage} alt={p.title} fill className="object-cover" unoptimized />
                      <span
                        className={`absolute top-2 left-2 h-4 w-4 rounded border flex items-center justify-center text-[10px] ${
                          selected
                            ? "bg-white border-white text-black"
                            : "border-white/30 bg-black/40"
                        }`}
                      >
                        {selected ? "✓" : ""}
                      </span>
                    </div>
                    <div className="p-2">
                      <p className="text-xs text-[var(--admin-text)] truncate">{p.title}</p>
                      <p className="text-[10px] text-[var(--admin-subtle)]">{p.category}</p>
                    </div>
                  </button>
                );
              })}
            <Link
              href="/admin/projects/new"
              className="admin-project-pick flex flex-col items-center justify-center min-h-[120px] border-dashed text-[var(--admin-subtle)] hover:text-[var(--admin-muted)] hover:border-[var(--admin-border-strong)]"
            >
              <span className="text-2xl leading-none">+</span>
              <span className="text-xs mt-2">添加作品</span>
            </Link>
          </div>
          {featuredProjects.length > 0 ? (
            <p className="text-xs text-[var(--admin-subtle)] mt-4">
              已选 {featuredProjects.length} 个精选作品
            </p>
          ) : null}
        </AdminCard>

        <AdminCard title="站点基础信息" description="姓名、职业标题与一句话介绍">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="姓名（中文）">
              <AdminInput value={site.name} onChange={(e) => setSite({ ...site, name: e.target.value })} />
            </AdminField>
            <AdminField label="职业标题">
              <AdminInput value={site.title} onChange={(e) => setSite({ ...site, title: e.target.value })} />
            </AdminField>
          </div>
          <div className="mt-4">
            <AdminField label="一句话介绍">
              <AdminTextarea
                className="min-h-20"
                value={site.headline}
                onChange={(e) => setSite({ ...site, headline: e.target.value })}
              />
            </AdminField>
          </div>
        </AdminCard>

        <AdminStatus message={message} error={error} />
      </div>
    </AdminShell>
  );
}
