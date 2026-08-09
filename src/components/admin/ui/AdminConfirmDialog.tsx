"use client";

import { useEffect } from "react";
import { AdminButton } from "./AdminButton";
import { cn } from "./cn";

type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function AdminConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "确认",
  cancelLabel = "取消",
  variant = "danger",
  loading,
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="关闭"
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full max-w-md rounded-[var(--admin-radius)] border border-[var(--admin-border-strong)]",
          "bg-[var(--admin-panel)] p-6 shadow-2xl",
        )}
      >
        <h3 className="text-base font-medium text-[var(--admin-text)]">{title}</h3>
        {description ? (
          <p className="mt-2 text-sm text-[var(--admin-muted)] leading-relaxed">{description}</p>
        ) : null}
        <div className="mt-6 flex justify-end gap-2">
          <AdminButton variant="ghost" size="sm" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </AdminButton>
          <AdminButton
            variant={variant === "danger" ? "danger" : "primary"}
            size="sm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "处理中…" : confirmLabel}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
