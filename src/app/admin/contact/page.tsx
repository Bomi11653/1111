"use client";

import { useEffect, useState } from "react";
import {
  AdminField,
  AdminSaveButton,
  AdminShell,
  AdminStatus,
} from "@/components/admin/AdminShell";
import { AdminButton, AdminCard, AdminInput, AdminLoading } from "@/components/admin/ui";
import type { SiteContent } from "@/lib/cms-types";
import { cmsFetch, cmsSave } from "@/lib/admin";

export default function AdminContactPage() {
  const [site, setSite] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    cmsFetch<SiteContent>("/api/cms/site")
      .then(setSite)
      .catch((err) => setError(err instanceof Error ? err.message : "加载失败"));
  }, []);

  const save = async () => {
    if (!site) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const saved = await cmsSave<SiteContent>("/api/cms/site", site);
      setSite(saved);
      setMessage("联系方式已保存。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  if (!site) {
    return (
      <AdminShell title="系统设置" description="加载中…">
        <AdminLoading className="py-16" label={error || "正在读取内容配置…"} />
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="系统设置"
      description="管理邮箱、简历路径与社交链接。"
      actions={<AdminSaveButton saving={saving} onClick={save} />}
    >
      <div className="max-w-3xl space-y-6">
        <AdminCard title="联系方式">
          <AdminField label="联系邮箱">
            <AdminInput value={site.email} onChange={(e) => setSite({ ...site, email: e.target.value })} />
          </AdminField>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <AdminField label="简历文件名">
              <AdminInput
                value={site.resumeFilename}
                onChange={(e) => setSite({ ...site, resumeFilename: e.target.value })}
              />
            </AdminField>
            <AdminField label="简历路径">
              <AdminInput
                value={site.resumePath}
                onChange={(e) => setSite({ ...site, resumePath: e.target.value })}
              />
            </AdminField>
          </div>
        </AdminCard>

        <AdminCard title="社交链接">
          <AdminField label="Bilibili URL">
            <AdminInput
              value={site.social.bilibili.url}
              onChange={(e) =>
                setSite({
                  ...site,
                  social: {
                    ...site.social,
                    bilibili: { ...site.social.bilibili, url: e.target.value },
                  },
                })
              }
            />
          </AdminField>
          <div className="mt-4">
            <AdminField label="GGAC URL">
              <AdminInput
                value={site.social.ggac.url}
                onChange={(e) =>
                  setSite({
                    ...site,
                    social: {
                      ...site.social,
                      ggac: { ...site.social.ggac, url: e.target.value },
                    },
                  })
                }
              />
            </AdminField>
          </div>
        </AdminCard>

        <AdminStatus message={message} error={error} />
      </div>
    </AdminShell>
  );
}
