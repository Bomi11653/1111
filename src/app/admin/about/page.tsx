"use client";

import { useEffect, useState } from "react";
import {
  AdminField,
  AdminSaveButton,
  AdminShell,
  AdminStatus,
} from "@/components/admin/AdminShell";
import { AdminButton, AdminCard, AdminInput, AdminLoading, AdminTextarea } from "@/components/admin/ui";
import type { SiteContent } from "@/lib/cms-types";
import { cmsFetch, cmsSave } from "@/lib/admin";

export default function AdminAboutPage() {
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
      setMessage("关于我内容已保存。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  if (!site) {
    return (
      <AdminShell title="关于我" description="加载中…">
        <AdminLoading className="py-16" label={error || "正在读取内容配置…"} />
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="关于我"
      description="编辑工作经历、设计理念与技能熟练度。"
      actions={<AdminSaveButton saving={saving} onClick={save} />}
    >
      <div className="max-w-3xl space-y-6">
        <AdminCard title="工作经历">
          <div className="grid gap-5 md:grid-cols-2">
            <AdminField label="工作年限">
              <AdminInput
                type="number"
                value={site.experience.years}
                onChange={(e) =>
                  setSite({
                    ...site,
                    experience: { ...site.experience, years: Number(e.target.value) || 0 },
                  })
                }
              />
            </AdminField>
            <AdminField label="公司">
              <AdminInput
                value={site.experience.company}
                onChange={(e) =>
                  setSite({
                    ...site,
                    experience: { ...site.experience, company: e.target.value },
                  })
                }
              />
            </AdminField>
          </div>
          <div className="mt-4">
            <AdminField label="经历摘要">
              <AdminTextarea
                className="min-h-28"
                value={site.experience.summary}
                onChange={(e) =>
                  setSite({
                    ...site,
                    experience: { ...site.experience, summary: e.target.value },
                  })
                }
              />
            </AdminField>
          </div>
        </AdminCard>

        <AdminCard title="设计理念">
          {site.philosophy.map((line, index) => (
            <AdminField key={index} label={`理念 ${index + 1}`}>
              <AdminTextarea
                className="min-h-20"
                value={line}
                onChange={(e) => {
                  const next = [...site.philosophy];
                  next[index] = e.target.value;
                  setSite({ ...site, philosophy: next });
                }}
              />
            </AdminField>
          ))}
        </AdminCard>

        <AdminCard
          title="技能列表"
          actions={
            <AdminButton
              variant="ghost"
              size="sm"
              onClick={() =>
                setSite({
                  ...site,
                  skills: [...site.skills, { name: "新技能", level: 50, category: "其他" }],
                })
              }
            >
              + 添加技能
            </AdminButton>
          }
        >
          {site.skills.map((skill, index) => (
            <div key={index} className="grid gap-3 md:grid-cols-[1fr_120px_120px_auto] items-end mb-4 last:mb-0">
              <AdminField label="技能名称">
                <AdminInput
                  value={skill.name}
                  onChange={(e) => {
                    const next = [...site.skills];
                    next[index] = { ...skill, name: e.target.value };
                    setSite({ ...site, skills: next });
                  }}
                />
              </AdminField>
              <AdminField label="熟练度 %">
                <AdminInput
                  type="number"
                  value={skill.level}
                  onChange={(e) => {
                    const next = [...site.skills];
                    next[index] = { ...skill, level: Number(e.target.value) || 0 };
                    setSite({ ...site, skills: next });
                  }}
                />
              </AdminField>
              <AdminField label="分类">
                <AdminInput
                  value={skill.category}
                  onChange={(e) => {
                    const next = [...site.skills];
                    next[index] = { ...skill, category: e.target.value };
                    setSite({ ...site, skills: next });
                  }}
                />
              </AdminField>
              <AdminButton
                variant="danger"
                size="sm"
                onClick={() =>
                  setSite({ ...site, skills: site.skills.filter((_, i) => i !== index) })
                }
              >
                删除
              </AdminButton>
            </div>
          ))}
        </AdminCard>

        <AdminStatus message={message} error={error} />
      </div>
    </AdminShell>
  );
}
