"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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
  AdminSwitch,
  AdminTextarea,
} from "@/components/admin/ui";
import type { SeoContent } from "@/lib/cms-types";
import { cmsFetch, cmsSave } from "@/lib/admin";

export function AdminSeoClient() {
  const [seo, setSeo] = useState<SeoContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    cmsFetch<SeoContent>("/api/cms/seo")
      .then(setSeo)
      .catch((err) => setError(err instanceof Error ? err.message : "加载失败"));
  }, []);

  const save = async () => {
    if (!seo) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const saved = await cmsSave<SeoContent>("/api/cms/seo", seo);
      setSeo(saved);
      setMessage("SEO 设置已保存。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  const uploadOg = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("projectId", "seo");
      const res = await fetch("/api/cms/upload", { method: "POST", body: fd });
      const body = await res.json();
      if (!res.ok || !body.ok) throw new Error(body.error ?? "上传失败");
      setSeo((prev) => (prev ? { ...prev, ogImage: body.data.url } : prev));
      setMessage("分享图已上传");
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败");
    } finally {
      setUploading(false);
    }
  };

  if (!seo) {
    return (
      <AdminShell title="SEO 设置" description="加载中…">
        <AdminLoading className="py-16" label={error || "正在读取 SEO 配置…"} />
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="SEO 设置"
      description="管理全站标题、描述、关键词与社交分享图。"
      actions={<AdminSaveButton saving={saving} onClick={save} />}
    >
      <div className="max-w-2xl space-y-6">
        <AdminCard title="全站 SEO">
          <div className="space-y-4">
            <AdminField label="网站标题">
              <AdminInput
                value={seo.siteTitle}
                onChange={(e) => setSeo({ ...seo, siteTitle: e.target.value })}
              />
            </AdminField>
            <AdminField label="网站描述">
              <AdminTextarea
                className="min-h-24"
                value={seo.siteDescription}
                onChange={(e) => setSeo({ ...seo, siteDescription: e.target.value })}
              />
            </AdminField>
            <AdminField label="关键词（逗号分隔）">
              <AdminInput
                value={seo.keywords.join(", ")}
                onChange={(e) =>
                  setSeo({
                    ...seo,
                    keywords: e.target.value.split(",").map((k) => k.trim()).filter(Boolean),
                  })
                }
              />
            </AdminField>
          </div>
        </AdminCard>

        <AdminCard title="分享图 (Open Graph)">
          {seo.ogImage ? (
            <div className="relative aspect-[1.91/1] max-w-md rounded overflow-hidden border border-[var(--admin-border)] mb-4">
              <Image src={seo.ogImage} alt="OG" fill className="object-cover" unoptimized />
            </div>
          ) : (
            <p className="text-sm text-[var(--admin-subtle)] mb-4">尚未设置分享图</p>
          )}
          <label className="inline-block cursor-pointer">
            <span className="inline-flex items-center justify-center h-8 px-3 text-xs font-medium rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] text-[var(--admin-text)] hover:border-[var(--admin-border-strong)] transition-colors">
              {uploading ? "上传中…" : "上传分享图"}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadOg(f);
              }}
            />
          </label>
          <div className="mt-4">
            <AdminField label="或填写图片 URL">
              <AdminInput
                value={seo.ogImage}
                onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                placeholder="/uploads/..."
              />
            </AdminField>
          </div>
        </AdminCard>

        <AdminCard title="页面 SEO">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="首页标题">
              <AdminInput
                value={seo.homeTitle}
                onChange={(e) => setSeo({ ...seo, homeTitle: e.target.value })}
              />
            </AdminField>
            <AdminField label="作品页标题">
              <AdminInput
                value={seo.worksTitle}
                onChange={(e) => setSeo({ ...seo, worksTitle: e.target.value })}
              />
            </AdminField>
            <AdminField label="关于页标题">
              <AdminInput
                value={seo.aboutTitle}
                onChange={(e) => setSeo({ ...seo, aboutTitle: e.target.value })}
              />
            </AdminField>
            <AdminField label="联系页标题">
              <AdminInput
                value={seo.contactTitle}
                onChange={(e) => setSeo({ ...seo, contactTitle: e.target.value })}
              />
            </AdminField>
          </div>
          <div className="mt-4 space-y-4">
            <AdminField label="首页描述">
              <AdminTextarea
                className="min-h-16"
                value={seo.homeDescription}
                onChange={(e) => setSeo({ ...seo, homeDescription: e.target.value })}
              />
            </AdminField>
            <AdminField label="作品页描述">
              <AdminTextarea
                className="min-h-16"
                value={seo.worksDescription}
                onChange={(e) => setSeo({ ...seo, worksDescription: e.target.value })}
              />
            </AdminField>
            <AdminField label="关于页描述">
              <AdminTextarea
                className="min-h-16"
                value={seo.aboutDescription}
                onChange={(e) => setSeo({ ...seo, aboutDescription: e.target.value })}
              />
            </AdminField>
            <AdminField label="联系页描述">
              <AdminTextarea
                className="min-h-16"
                value={seo.contactDescription}
                onChange={(e) => setSeo({ ...seo, contactDescription: e.target.value })}
              />
            </AdminField>
          </div>
        </AdminCard>

        <AdminCard title="站点资源">
          <div className="space-y-4">
            <AdminField label="Favicon URL">
              <AdminInput
                value={seo.favicon}
                onChange={(e) => setSeo({ ...seo, favicon: e.target.value })}
                placeholder="/uploads/favicon.ico"
              />
            </AdminField>
            <div className="flex flex-wrap gap-4">
              <AdminSwitch
                checked={seo.robotsAllow}
                onChange={(v) => setSeo({ ...seo, robotsAllow: v })}
                label="允许搜索引擎索引 (robots.txt)"
              />
              <AdminSwitch
                checked={seo.sitemapEnabled}
                onChange={(v) => setSeo({ ...seo, sitemapEnabled: v })}
                label="启用 sitemap.xml"
              />
            </div>
          </div>
        </AdminCard>

        <AdminStatus message={message} error={error} />
      </div>
    </AdminShell>
  );
}
