export const navItems = [
  { href: "/", label: "首页" },
  { href: "/works", label: "作品" },
  { href: "/about", label: "关于" },
  { href: "/contact", label: "联系" },
] as const;

export type { SiteContent } from "@/lib/cms-types";
