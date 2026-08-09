"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { History, RotateCcw } from "lucide-react";
import {
  AdminButton,
  AdminCard,
  AdminConfirmDialog,
  AdminEmpty,
  AdminLoading,
} from "@/components/admin/ui";
import type { BackupEntry } from "@/lib/cms-types";

export function AdminBackupsPanel() {
  const [backups, setBackups] = useState<BackupEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [restoring, setRestoring] = useState<string | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<BackupEntry | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/cms/backups");
      const body = await res.json();
      if (!res.ok || !body.ok) throw new Error(body.error ?? "加载失败");
      setBackups(body.data as BackupEntry[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const restore = async () => {
    if (!restoreTarget) return;
    setRestoring(restoreTarget.name);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/cms/backups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ backupName: restoreTarget.name }),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) throw new Error(body.error ?? "恢复失败");
      setMessage(`已恢复 ${body.data.sourceFile}（恢复前已自动备份当前版本）`);
      setRestoreTarget(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "恢复失败");
    } finally {
      setRestoring(null);
    }
  };

  return (
    <>
      <AdminCard
        title="数据备份"
        description="每次保存 content/*.json 前自动备份，最多保留最近 20 份。"
        actions={
          <button
            type="button"
            onClick={load}
            className="text-xs text-[var(--admin-muted)] hover:text-[var(--admin-text)]"
          >
            刷新
          </button>
        }
      >
        {loading ? (
          <AdminLoading className="py-8" label="正在读取备份列表…" />
        ) : error && backups.length === 0 ? (
          <AdminEmpty title="加载失败" description={error} />
        ) : backups.length === 0 ? (
          <AdminEmpty title="暂无备份" description="保存任意 CMS 配置后将自动生成备份。" />
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {backups.slice(0, 20).map((b) => (
              <div
                key={b.name}
                className="flex items-center justify-between gap-3 rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] px-3 py-2.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[var(--admin-text)] truncate flex items-center gap-2">
                    <History className="h-3.5 w-3.5 shrink-0 opacity-50" />
                    {b.sourceFile}
                  </p>
                  <p className="text-xs text-[var(--admin-subtle)] mt-0.5">
                    {new Date(b.createdAt).toLocaleString("zh-CN")} · {(b.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <AdminButton
                  variant="outline"
                  size="sm"
                  disabled={restoring === b.name}
                  onClick={() => setRestoreTarget(b)}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  恢复
                </AdminButton>
              </div>
            ))}
          </div>
        )}
        {message ? <p className="mt-3 text-xs text-[var(--admin-muted)]">{message}</p> : null}
        {error && backups.length > 0 ? (
          <p className="mt-3 text-xs text-red-300">{error}</p>
        ) : null}
      </AdminCard>

      <AdminConfirmDialog
        open={Boolean(restoreTarget)}
        title="恢复备份"
        description={
          restoreTarget
            ? `确定将 ${restoreTarget.sourceFile} 恢复到此备份（${new Date(restoreTarget.createdAt).toLocaleString("zh-CN")}）？当前版本会先自动备份。`
            : ""
        }
        confirmLabel="确认恢复"
        variant="danger"
        loading={Boolean(restoring)}
        onConfirm={restore}
        onCancel={() => setRestoreTarget(null)}
      />
    </>
  );
}
