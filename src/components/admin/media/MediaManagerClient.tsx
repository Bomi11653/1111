"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Copy, Trash2, Upload } from "lucide-react";
import { AdminShell, AdminStatus } from "@/components/admin/AdminShell";
import {
  AdminBadge,
  AdminButton,
  AdminConfirmDialog,
  AdminEmpty,
  AdminInput,
  AdminLoading,
  AdminToolbar,
  cn,
} from "@/components/admin/ui";

type MediaFile = {
  url: string;
  filename: string;
  size: number;
  type: string;
  uploadedAt: string;
  usedIn: string[];
};

type Filter = "全部" | "图片" | "视频链接" | "PDF" | "封面图" | "未使用资源";

const FILTERS: Filter[] = ["全部", "图片", "视频链接", "PDF", "封面图", "未使用资源"];

export function MediaManagerClient() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [selected, setSelected] = useState<MediaFile | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("全部");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [acting, setActing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteForce, setDeleteForce] = useState(false);
  const replaceRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoadState("loading");
    try {
      const res = await fetch("/api/cms/media");
      const body = await res.json();
      if (!res.ok || !body.ok) throw new Error(body.error ?? "加载失败");
      setFiles(body.data as MediaFile[]);
      setLoadState("ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载失败");
      setLoadState("error");
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [load]);

  const filtered = useMemo(() => {
    return files.filter((f) => {
      const q = search.trim().toLowerCase();
      const matchSearch = !q || f.filename.toLowerCase().includes(q) || f.url.toLowerCase().includes(q);
      const matchFilter =
        filter === "全部" ||
        (filter === "图片" && f.type === "image") ||
        (filter === "视频链接" && f.type === "video") ||
        (filter === "PDF" && f.type === "pdf") ||
        (filter === "封面图" && f.usedIn.some((u) => u.includes("封面"))) ||
        (filter === "未使用资源" && f.usedIn.length === 0);
      return matchSearch && matchFilter;
    });
  }, [files, filter, search]);

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${url}`);
      setMessage("链接已复制");
      setError("");
    } catch {
      setError("复制失败");
    }
  };

  const canManage = selected?.url.startsWith("/uploads/");

  const replaceFile = async (file: File) => {
    if (!selected || !canManage) return;
    setActing(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("url", selected.url);
      const res = await fetch("/api/cms/media", { method: "PUT", body: fd });
      const body = await res.json();
      if (!res.ok || !body.ok) throw new Error(body.error ?? "替换失败");
      setMessage("文件已替换");
      await load();
      setSelected((prev) =>
        prev ? { ...prev, size: body.data.size, uploadedAt: new Date().toISOString() } : prev,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "替换失败");
    } finally {
      setActing(false);
    }
  };

  const deleteFile = async () => {
    if (!selected) return;
    setActing(true);
    setError("");
    try {
      const res = await fetch("/api/cms/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: selected.url, force: deleteForce }),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) {
        if (body.usedIn?.length) {
          setError(`资源正在使用：${body.usedIn.join("、")}。可勾选强制删除。`);
        } else {
          throw new Error(body.error ?? "删除失败");
        }
        return;
      }
      setMessage("资源已删除");
      setSelected(null);
      setDeleteOpen(false);
      setDeleteForce(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除失败");
    } finally {
      setActing(false);
    }
  };

  if (loadState === "loading") {
    return (
      <AdminShell title="媒体资源" description="正在加载媒体库…">
        <AdminLoading className="py-16" />
      </AdminShell>
    );
  }

  if (loadState === "error") {
    return (
      <AdminShell title="媒体资源" description="加载失败">
        <AdminEmpty title="加载失败" description={error} action={<AdminButton onClick={load}>重试</AdminButton>} />
      </AdminShell>
    );
  }

  const detailPanel = selected ? (
    <div className="space-y-4">
      <div className="relative aspect-video bg-[var(--admin-panel-soft)] rounded overflow-hidden border border-[var(--admin-border)]">
        {selected.type === "image" ? (
          <Image src={selected.url} alt={selected.filename} fill className="object-cover" unoptimized />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--admin-subtle)] text-sm uppercase">
            {selected.type}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm text-[var(--admin-text)]">{selected.filename}</p>
        <p className="text-xs text-[var(--admin-subtle)] mt-1">
          {(selected.size / 1024).toFixed(1)} KB · {selected.type}
        </p>
        {selected.uploadedAt ? (
          <p className="text-[10px] text-[var(--admin-subtle)] mt-1">
            {new Date(selected.uploadedAt).toLocaleString("zh-CN")}
          </p>
        ) : null}
      </div>
      <p className="text-xs text-[var(--admin-muted)] break-all font-mono">{selected.url}</p>
      <div className="flex flex-wrap gap-2">
        <AdminButton variant="outline" size="sm" onClick={() => copyUrl(selected.url)}>
          <Copy className="h-3.5 w-3.5" />
          复制地址
        </AdminButton>
        {canManage && selected.type === "image" ? (
          <>
            <AdminButton
              variant="outline"
              size="sm"
              disabled={acting}
              onClick={() => replaceRef.current?.click()}
            >
              <Upload className="h-3.5 w-3.5" />
              {acting ? "处理中…" : "替换文件"}
            </AdminButton>
            <input
              ref={replaceRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) replaceFile(f);
                e.target.value = "";
              }}
            />
            <AdminButton
              variant="danger"
              size="sm"
              disabled={acting}
              onClick={() => {
                setDeleteForce(false);
                setDeleteOpen(true);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              删除
            </AdminButton>
          </>
        ) : null}
      </div>
      {!canManage ? (
        <p className="text-xs text-[var(--admin-subtle)]">内置 /works 资源只读，不可替换或删除</p>
      ) : null}
      {selected.usedIn.length > 0 ? (
        <div>
          <p className="text-[10px] text-[var(--admin-subtle)] uppercase tracking-wide mb-2">使用位置</p>
          <ul className="space-y-1">
            {selected.usedIn.map((u) => (
              <li key={u}>
                <AdminBadge variant="neutral">{u}</AdminBadge>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <AdminBadge variant="hidden">未被项目引用</AdminBadge>
      )}
    </div>
  ) : (
    <p className="text-sm text-[var(--admin-subtle)]">选择资源查看详情</p>
  );

  return (
    <AdminShell
      title="媒体资源"
      description="统一管理图片、视频链接与项目素材。"
      preview={detailPanel}
      previewTitle="资源详情"
    >
      <AdminToolbar>
        {FILTERS.map((f) => (
          <AdminButton
            key={f}
            variant={filter === f ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f}
          </AdminButton>
        ))}
        <AdminInput
          className="ml-auto max-w-xs"
          placeholder="搜索文件名"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </AdminToolbar>

      {filtered.length === 0 ? (
        <AdminEmpty title="暂无资源" description="当前筛选条件下没有匹配的媒体文件。" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((f) => (
            <button
              key={f.url}
              type="button"
              onClick={() => setSelected(f)}
              className={cn(
                "text-left rounded-[var(--admin-radius-sm)] border p-2 transition-colors duration-200",
                selected?.url === f.url
                  ? "border-[var(--admin-border-strong)] bg-white/[0.04]"
                  : "border-[var(--admin-border)] hover:border-[var(--admin-border-strong)] hover:bg-white/[0.02]",
              )}
            >
              <div className="relative aspect-square bg-[var(--admin-panel-soft)] rounded overflow-hidden mb-2">
                {f.type === "image" ? (
                  <Image src={f.url} alt={f.filename} fill className="object-cover" unoptimized />
                ) : (
                  <div className="flex items-center justify-center h-full text-[var(--admin-subtle)] text-xs uppercase">
                    {f.type}
                  </div>
                )}
              </div>
              <p className="text-xs text-[var(--admin-text)] truncate">{f.filename}</p>
              <p className="text-[10px] text-[var(--admin-subtle)]">{(f.size / 1024).toFixed(1)} KB</p>
            </button>
          ))}
        </div>
      )}

      <AdminStatus message={message} error={error} />

      <AdminConfirmDialog
        open={deleteOpen}
        title="删除资源"
        description={
          selected
            ? selected.usedIn.length > 0
              ? `「${selected.filename}」正在被使用：${selected.usedIn.join("、")}。强制删除可能导致前台出现破图。`
              : `确定删除「${selected.filename}」？此操作不可撤销。`
            : undefined
        }
        confirmLabel={deleteForce || !selected?.usedIn.length ? "删除" : "强制删除"}
        loading={acting}
        onConfirm={() => {
          if (selected?.usedIn.length && !deleteForce) {
            setDeleteForce(true);
            return;
          }
          deleteFile();
        }}
        onCancel={() => {
          setDeleteOpen(false);
          setDeleteForce(false);
        }}
      />
    </AdminShell>
  );
}
