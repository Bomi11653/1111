"use client";

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
  AdminEmpty,
  AdminInput,
  AdminLoading,
  AdminModuleRow,
  AdminTextarea,
} from "@/components/admin/ui";
import type { ModuleConfig, ModulePageKey, ModulesContent } from "@/lib/cms-types";

const PAGE_LABELS: { key: ModulePageKey; label: string }[] = [
  { key: "home", label: "首页" },
  { key: "works", label: "作品页" },
  { key: "workDetail", label: "作品详情" },
  { key: "about", label: "关于页" },
  { key: "contact", label: "联系页" },
];

type LoadState = "loading" | "ready" | "error";

function updateModule(
  content: ModulesContent,
  page: ModulePageKey,
  index: number,
  patch: Partial<ModuleConfig>,
): ModulesContent {
  const next = [...content[page]];
  next[index] = { ...next[index], ...patch };
  return { ...content, [page]: next };
}

export function ModulesManagerClient() {
  const [modules, setModules] = useState<ModulesContent | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadState("loading");
      setLoadError("");
      try {
        const res = await fetch("/api/cms/modules");
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `加载失败 (${res.status})`);
        }
        const data = (await res.json()) as ModulesContent;
        if (!cancelled) {
          setModules(data);
          setLoadState("ready");
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : "加载模块配置失败");
          setLoadState("error");
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const save = async () => {
    if (!modules) return;
    setSaving(true);
    setMessage("");
    setSaveError("");
    try {
      const res = await fetch("/api/cms/modules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modules),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) {
        throw new Error(body.error ?? "保存失败");
      }
      setModules(body.data as ModulesContent);
      setMessage("模块显示设置已保存，刷新前台即可看到更新。");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  if (loadState === "loading") {
    return (
      <AdminShell title="模块显示控制" description="正在加载模块配置…">
        <AdminLoading className="py-16" />
      </AdminShell>
    );
  }

  if (loadState === "error" || !modules) {
    return (
      <AdminShell title="模块显示控制" description="加载失败">
        <AdminEmpty
          title="加载模块配置失败"
          description={loadError || "未知错误"}
          action={
            <AdminButton variant="outline" onClick={() => window.location.reload()}>
              重试
            </AdminButton>
          }
        />
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="模块显示"
      description="按页面分组控制模块的显示、排序、标题与说明。"
      actions={<AdminSaveButton saving={saving} onClick={save} />}
    >
      <div className="space-y-6 max-w-4xl">
        {PAGE_LABELS.map(({ key, label }) => (
          <AdminCard key={key} title={label} description={`${modules[key].length} 个模块`} padding="sm">
            {[...modules[key]]
              .sort((a, b) => a.order - b.order)
              .map((mod) => {
                const index = modules[key].findIndex((m) => m.id === mod.id);
                const sorted = [...modules[key]].sort((a, b) => a.order - b.order);
                const pos = sorted.findIndex((m) => m.id === mod.id);
                return (
                  <div key={mod.id} className="space-y-3 pb-4 mb-4 border-b border-[var(--admin-border)] last:border-0 last:mb-0 last:pb-0">
                    <AdminModuleRow
                      title={mod.title}
                      description={mod.description}
                      enabled={mod.enabled}
                      order={mod.order}
                      onEnabledChange={(enabled) =>
                        setModules(updateModule(modules, key, index, { enabled }))
                      }
                      onOrderChange={(order) =>
                        setModules(updateModule(modules, key, index, { order }))
                      }
                      onMoveUp={
                        pos > 0
                          ? () => {
                              const prev = sorted[pos - 1];
                              setModules(
                                updateModule(
                                  updateModule(modules, key, index, { order: prev.order }),
                                  key,
                                  modules[key].findIndex((m) => m.id === prev.id),
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
                                updateModule(
                                  updateModule(modules, key, index, { order: next.order }),
                                  key,
                                  modules[key].findIndex((m) => m.id === next.id),
                                  { order: mod.order },
                                ),
                              );
                            }
                          : undefined
                      }
                    />
                    <div className="pl-8 grid gap-3 md:grid-cols-2">
                      <AdminField label="模块标题">
                        <AdminInput
                          value={mod.title}
                          onChange={(e) =>
                            setModules(updateModule(modules, key, index, { title: e.target.value }))
                          }
                        />
                      </AdminField>
                      <AdminField label="说明文字">
                        <AdminTextarea
                          className="min-h-14"
                          value={mod.description}
                          onChange={(e) =>
                            setModules(
                              updateModule(modules, key, index, { description: e.target.value }),
                            )
                          }
                        />
                      </AdminField>
                    </div>
                    <p className="pl-8 text-[10px] text-[var(--admin-subtle)] font-mono">
                      page: {mod.page} · key: {mod.key}
                    </p>
                  </div>
                );
              })}
          </AdminCard>
        ))}

        <AdminStatus message={message} error={saveError} />
      </div>
    </AdminShell>
  );
}
