"use client";

import { useState, type ReactNode } from "react";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { cn } from "./cn";

type Device = "desktop" | "tablet" | "mobile";

type Props = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function AdminPreviewPanel({ title = "实时预览", children, className }: Props) {
  const [device, setDevice] = useState<Device>("desktop");

  const devices: { id: Device; icon: typeof Monitor; label: string }[] = [
    { id: "desktop", icon: Monitor, label: "桌面" },
    { id: "tablet", icon: Tablet, label: "平板" },
    { id: "mobile", icon: Smartphone, label: "手机" },
  ];

  return (
    <aside
      className={cn(
        "w-[340px] shrink-0 border-l border-[var(--admin-border)] bg-[var(--admin-bg)] flex flex-col",
        className,
      )}
    >
      <div className="admin-preview-frame m-4 flex flex-1 flex-col min-h-0">
        <div className="admin-preview-chrome">
          <span className="text-xs font-medium text-[var(--admin-muted)] tracking-wide">{title}</span>
          <div className="flex items-center gap-1">
            {devices.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                type="button"
                title={label}
                onClick={() => setDevice(id)}
                className={cn(
                  "p-1.5 rounded-[4px] transition-colors",
                  device === id
                    ? "text-[var(--admin-text)] bg-white/[0.08]"
                    : "text-[var(--admin-subtle)] hover:text-[var(--admin-muted)]",
                )}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            ))}
          </div>
        </div>
        <div
          className={cn(
            "admin-preview-viewport flex-1 overflow-y-auto p-4",
            device === "tablet" && "admin-preview-viewport--tablet",
            device === "mobile" && "admin-preview-viewport--mobile",
          )}
        >
          {children}
        </div>
      </div>
    </aside>
  );
}
