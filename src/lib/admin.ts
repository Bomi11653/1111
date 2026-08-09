import type { LucideIcon } from "lucide-react";
import {
  FolderKanban,
  Home,
  ImageIcon,
  LayoutDashboard,
  LayoutGrid,
  Search,
  Settings,
  User,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const adminNavItems: AdminNavItem[] = [
  { href: "/admin", label: "仪表盘", icon: LayoutDashboard },
  { href: "/admin/home", label: "首页管理", icon: Home },
  { href: "/admin/projects", label: "作品管理", icon: FolderKanban },
  { href: "/admin/media", label: "媒体资源", icon: ImageIcon },
  { href: "/admin/modules", label: "模块显示", icon: LayoutGrid },
  { href: "/admin/seo", label: "SEO 设置", icon: Search },
  { href: "/admin/about", label: "关于我", icon: User },
  { href: "/admin/contact", label: "系统设置", icon: Settings },
] as const;

export async function cmsFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `请求失败 (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function cmsSave<T>(url: string, data: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const body = await res.json();
  if (!res.ok || !body.ok) {
    throw new Error(body.error ?? "保存失败");
  }
  return body.data as T;
}
