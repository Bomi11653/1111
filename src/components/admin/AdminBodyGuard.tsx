"use client";

import { useEffect } from "react";

/** Ensures admin routes never inherit front-end custom cursor styles. */
export function AdminBodyGuard() {
  useEffect(() => {
    document.body.classList.add("admin-route");
    document.body.classList.remove("custom-cursor-active");
    return () => document.body.classList.remove("admin-route");
  }, []);
  return null;
}
