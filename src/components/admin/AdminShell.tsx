"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ExternalLink, Menu, X } from "lucide-react";
import { useState } from "react";
import { adminNavItems } from "@/lib/admin";
import { AdminButton, AdminLoading } from "@/components/admin/ui";

type Props = {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  loading?: boolean;
  rail?: React.ReactNode;
  preview?: React.ReactNode;
  previewTitle?: string;
};

export function AdminShell({
  title,
  description,
  children,
  actions,
  loading,
  rail,
  preview,
  previewTitle,
}: Props) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string, label: string) => {
    if (href === "/admin") return pathname === "/admin";
    if (label === "SEO 设置") return pathname === "/admin/seo";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const nav = (
    <>
      <div className="px-5 py-6 border-b border-[var(--admin-border)]">
        <p className="text-[10px] tracking-[0.35em] text-[var(--admin-subtle)] uppercase">
          Portfolio CMS
        </p>
        <p className="mt-2 text-sm font-medium text-[var(--admin-text)]">作品集管理系统</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {adminNavItems.map((item) => {
          const active = isActive(item.href, item.label);
          const Icon = item.icon;
          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-[var(--admin-radius-sm)] px-3 py-2.5 text-sm transition-colors duration-200 ${
                active
                  ? "bg-white/[0.07] text-[var(--admin-text)] border border-[var(--admin-border-strong)]"
                  : "text-[var(--admin-muted)] hover:bg-white/[0.04] hover:text-[var(--admin-text)] border border-transparent"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-75" strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-[var(--admin-border)] space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full border border-[var(--admin-border)] bg-[var(--admin-panel-soft)] flex items-center justify-center text-xs text-[var(--admin-muted)]">
            A
          </div>
          <div>
            <p className="text-sm text-[var(--admin-text)]">Admin</p>
            <p className="text-[10px] text-[var(--admin-subtle)]">管理员</p>
          </div>
        </div>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 text-xs text-[var(--admin-muted)] hover:text-[var(--admin-text)] transition-colors"
        >
          查看网站
          <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
        </Link>
      </div>
    </>
  );

  return (
    <div className="admin-shell min-h-screen flex flex-col md:flex-row">
      {sidebarOpen ? (
        <button
          type="button"
          aria-label="关闭菜单"
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-[248px] shrink-0 border-r border-[var(--admin-border)] bg-[var(--admin-sidebar)] flex flex-col transform transition-transform duration-200 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {nav}
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="shrink-0 border-b border-[var(--admin-border)] px-4 md:px-8 py-4 md:py-5 flex items-start justify-between gap-4 bg-[var(--admin-bg)]">
          <div className="flex items-start gap-3 min-w-0">
            <button
              type="button"
              className="md:hidden mt-1 p-1.5 rounded border border-[var(--admin-border)] text-[var(--admin-muted)]"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label={sidebarOpen ? "关闭侧边栏" : "打开侧边栏"}
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-semibold tracking-tight text-[var(--admin-text)] truncate">
                {title}
              </h1>
              {description ? (
                <p className="mt-1 text-sm text-[var(--admin-subtle)] max-w-2xl leading-relaxed line-clamp-2">
                  {description}
                </p>
              ) : null}
            </div>
          </div>
          {actions ? (
            <div className="shrink-0 flex flex-wrap items-center justify-end gap-2 max-w-[50%]">
              {actions}
            </div>
          ) : null}
        </header>

        <div className="flex-1 flex flex-col xl:flex-row min-h-0 overflow-hidden">
          {rail ? (
            <aside className="w-full xl:w-[200px] shrink-0 border-b xl:border-b-0 xl:border-r border-[var(--admin-border)] bg-[var(--admin-sidebar)] px-3 py-4 xl:py-6 overflow-x-auto xl:overflow-y-auto">
              {rail}
            </aside>
          ) : null}

          <motion.main
            key={`${pathname}-main`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
            className="flex-1 overflow-y-auto px-4 md:px-8 py-6 md:py-8 min-w-0"
          >
            {loading ? <AdminLoading className="py-12" /> : children}
          </motion.main>

          {preview ? (
            <aside className="w-full xl:w-[360px] shrink-0 border-t xl:border-t-0 xl:border-l border-[var(--admin-border)] bg-[var(--admin-bg)] overflow-y-auto">
              <AdminPreviewChrome title={previewTitle}>{preview}</AdminPreviewChrome>
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function AdminPreviewChrome({ title = "实时预览", children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="p-4 xl:sticky xl:top-0">
      <div className="admin-preview-frame">
        <div className="admin-preview-chrome">
          <span className="text-xs font-medium text-[var(--admin-muted)]">{title}</span>
        </div>
        <div className="admin-preview-viewport p-4">{children}</div>
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  hint?: string;
  children: React.ReactNode;
};

export function AdminField({ label, hint, children }: FieldProps) {
  return (
    <label className="block">
      <span className="block text-sm text-[var(--admin-muted)] mb-2">{label}</span>
      {children}
      {hint ? <span className="block mt-1.5 text-xs text-[var(--admin-subtle)]">{hint}</span> : null}
    </label>
  );
}

export { adminInputStyles as adminInputClass } from "@/components/admin/ui";

export function AdminSaveButton({
  saving,
  onClick,
  label = "保存设置",
}: {
  saving: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <AdminButton variant="primary" onClick={onClick} disabled={saving}>
      {saving ? "保存中…" : label}
    </AdminButton>
  );
}

export function AdminStatus({ message, error }: { message?: string; error?: string }) {
  if (!message && !error) return null;
  return (
    <p
      className={`text-sm mt-6 px-4 py-3 rounded-[var(--admin-radius-sm)] border ${
        error
          ? "text-red-300 border-red-500/20 bg-red-500/5"
          : "text-[var(--admin-muted)] border-[var(--admin-border)] bg-white/[0.02]"
      }`}
    >
      {error ?? message}
    </p>
  );
}
