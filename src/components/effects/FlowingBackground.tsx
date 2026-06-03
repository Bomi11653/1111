"use client";

import { usePathname } from "next/navigation";

/** 空间光影背景 — 双光源锚点 + 极慢漂移 */
export function FlowingBackground() {
  const pathname = usePathname();
  if (pathname === "/about" || pathname === "/") return null;

  return (
    <div className="flow-bg fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      <div className="flow-bg__base" />
      <div className="flow-bg__blob flow-bg__blob--warm" />
      <div className="flow-bg__blob flow-bg__blob--cool" />
    </div>
  );
}
