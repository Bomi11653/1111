"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  clearTransitionPayload,
  readTransitionPayload,
  saveTransitionPayload,
  type TransitionPayload,
} from "@/lib/transition";

type OverlayMode = "off" | "expand" | "hold" | "exit";

type PageTransitionContextValue = {
  explode: number;
  startProjectTransition: (payload: TransitionPayload, href: string) => void;
  isTransitioning: boolean;
};

const PageTransitionContext = createContext<PageTransitionContextValue | null>(null);

const ease = [0.22, 1, 0.36, 1] as const;
const NAV_DELAY_MS = 720;

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mode, setMode] = useState<OverlayMode>("off");
  const [payload, setPayload] = useState<TransitionPayload | null>(null);
  const [explode, setExplode] = useState(0);
  const navigated = useRef(false);

  const startProjectTransition = useCallback(
    (data: TransitionPayload, href: string) => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        router.push(href);
        return;
      }

      saveTransitionPayload(data);
      setPayload(data);
      setExplode(1);
      setMode("expand");
      navigated.current = false;

      window.setTimeout(() => {
        setExplode(0);
      }, 1800);

      window.setTimeout(() => {
        setMode("hold");
        navigated.current = true;
        router.push(href);
      }, NAV_DELAY_MS);
    },
    [router],
  );

  useEffect(() => {
    const isDetail = /^\/works\/[^/]+$/.test(pathname);
    if (!isDetail) return;

    const stored = readTransitionPayload();
    if (stored && (mode === "hold" || mode === "off")) {
      setPayload(stored);
      setMode("exit");
      window.setTimeout(() => {
        setMode("off");
        setPayload(null);
        setExplode(0);
        clearTransitionPayload();
        navigated.current = false;
      }, 880);
    }
  }, [pathname, mode]);

  const showOverlay = mode !== "off" && payload;

  return (
    <PageTransitionContext.Provider
      value={{
        explode,
        startProjectTransition,
        isTransitioning: mode !== "off",
      }}
    >
      {children}

      <AnimatePresence>
        {showOverlay && (
          <motion.div
            key="page-transition"
            className="fixed z-[9998] pointer-events-none overflow-hidden"
            initial={
              mode === "exit"
                ? false
                : {
                    left: payload.x,
                    top: payload.y,
                    width: payload.w,
                    height: payload.h,
                    borderRadius: 12,
                    opacity: 0.95,
                  }
            }
            animate={
              mode === "exit"
                ? {
                    left: 0,
                    top: 0,
                    width: "100vw",
                    height: "100vh",
                    borderRadius: 0,
                    opacity: 0,
                    filter: "blur(28px)",
                  }
                : {
                    left: 0,
                    top: 0,
                    width: "100vw",
                    height: "100vh",
                    borderRadius: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                  }
            }
            exit={{ opacity: 0 }}
            transition={{ duration: mode === "exit" ? 0.85 : 0.92, ease }}
            style={{
              background: `radial-gradient(ellipse 85% 75% at 50% 45%, ${payload.color}ee, ${payload.secondaryColor} 50%, #0a0a0a 100%)`,
              boxShadow: `0 0 140px ${payload.color}99, inset 0 0 100px ${payload.secondaryColor}55`,
            }}
          />
        )}
      </AnimatePresence>
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  if (!ctx) throw new Error("usePageTransition must be used within PageTransitionProvider");
  return ctx;
}

export function usePageTransitionOptional() {
  return useContext(PageTransitionContext);
}
