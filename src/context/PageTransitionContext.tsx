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
  startTransition,
} from "react";
import { NavShutterOverlay } from "@/components/transitions/NavShutterOverlay";
import { scrollToElement } from "@/lib/smoothScroll";
import {
  clearTransitionPayload,
  readTransitionPayload,
  saveTransitionPayload,
  type TransitionPayload,
} from "@/lib/transition";

type ProjectMode = "off" | "expand" | "hold" | "exit";
type NavPhase = "off" | "closing" | "closed" | "opening";

export type NavRevealPayload = {
  label: string;
  meta: string;
  navId: string;
};

type NavTarget =
  | { type: "scroll"; targetId: string }
  | { type: "route"; href: string };

type PageTransitionContextValue = {
  explode: number;
  activeNavId: string | null;
  startProjectTransition: (payload: TransitionPayload, href: string) => void;
  startNavReveal: (payload: NavRevealPayload, target: NavTarget) => void;
  isTransitioning: boolean;
};

const PageTransitionContext = createContext<PageTransitionContextValue | null>(null);

const ease = [0.22, 1, 0.36, 1] as const;
const PROJECT_NAV_DELAY_MS = 680;
const NAV_CLOSE_MS = 620;
const NAV_OPEN_MS = 780;

function pulseSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add("section-nav-highlight");
  window.setTimeout(() => el.classList.remove("section-nav-highlight"), 1400);
}

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [projectMode, setProjectMode] = useState<ProjectMode>("off");
  const [projectPayload, setProjectPayload] = useState<TransitionPayload | null>(null);
  const [explode, setExplode] = useState(0);

  const [navPhase, setNavPhase] = useState<NavPhase>("off");
  const [navMeta, setNavMeta] = useState<NavRevealPayload | null>(null);
  const [activeNavId, setActiveNavId] = useState<string | null>(null);

  const navigated = useRef(false);
  const navTimers = useRef<number[]>([]);

  const clearNavTimers = useCallback(() => {
    navTimers.current.forEach((id) => window.clearTimeout(id));
    navTimers.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    navTimers.current.push(id);
  }, []);

  const finishNavTransition = useCallback(() => {
    setNavPhase("opening");
    schedule(() => {
      setNavPhase("off");
      setNavMeta(null);
      setActiveNavId(null);
    }, NAV_OPEN_MS);
  }, [schedule]);

  const startProjectTransition = useCallback(
    (data: TransitionPayload, href: string) => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        router.push(href);
        return;
      }

      clearNavTimers();
      saveTransitionPayload(data);
      setProjectPayload(data);
      setExplode(1);
      setProjectMode("expand");
      navigated.current = false;

      window.setTimeout(() => setExplode(0), 1800);

      window.setTimeout(() => {
        setProjectMode("hold");
        navigated.current = true;
        router.push(href);
      }, PROJECT_NAV_DELAY_MS);
    },
    [router, clearNavTimers],
  );

  const startNavReveal = useCallback(
    (data: NavRevealPayload, target: NavTarget) => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        if (target.type === "scroll") scrollToElement(target.targetId);
        else router.push(target.href);
        return;
      }

      clearNavTimers();
      setNavMeta(data);
      setActiveNavId(data.navId);
      setNavPhase("closing");

      schedule(() => {
        setNavPhase("closed");

        if (target.type === "scroll") {
          scrollToElement(target.targetId, 72, () => {
            pulseSection(target.targetId);
            schedule(() => finishNavTransition(), 180);
          });
          return;
        }

        router.push(target.href);
        schedule(() => finishNavTransition(), 420);
      }, NAV_CLOSE_MS);
    },
    [router, clearNavTimers, schedule, finishNavTransition],
  );

  useEffect(() => {
    const isDetail = /^\/works\/[^/]+$/.test(pathname);
    if (!isDetail) return;

    const stored = readTransitionPayload();
    if (stored && (projectMode === "hold" || projectMode === "off")) {
      startTransition(() => {
        setProjectPayload(stored);
        setProjectMode("exit");
      });
      window.setTimeout(() => {
        setProjectMode("off");
        setProjectPayload(null);
        setExplode(0);
        clearTransitionPayload();
        navigated.current = false;
      }, 880);
    }
  }, [pathname, projectMode]);

  useEffect(() => () => clearNavTimers(), [clearNavTimers]);

  const showProjectOverlay = projectMode !== "off" && projectPayload;
  const showNavOverlay = navPhase !== "off" && navMeta;

  return (
    <PageTransitionContext.Provider
      value={{
        explode,
        activeNavId,
        startProjectTransition,
        startNavReveal,
        isTransitioning: projectMode !== "off" || navPhase !== "off",
      }}
    >
      {children}

      {showNavOverlay && (
        <NavShutterOverlay
          phase={navPhase === "opening" ? "opening" : navPhase === "closed" ? "closed" : "closing"}
          label={navMeta.label}
          meta={navMeta.meta}
        />
      )}

      <AnimatePresence>
        {showProjectOverlay && (
          <motion.div
            key="page-transition"
            className="fixed z-[9997] pointer-events-none overflow-hidden"
            initial={
              projectMode === "exit"
                ? false
                : {
                    left: projectPayload.x,
                    top: projectPayload.y,
                    width: projectPayload.w,
                    height: projectPayload.h,
                    borderRadius: 12,
                    opacity: 0.95,
                  }
            }
            animate={
              projectMode === "exit"
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
            transition={{ duration: projectMode === "exit" ? 0.85 : 0.92, ease }}
            style={{
              background: `radial-gradient(ellipse 85% 75% at 50% 45%, ${projectPayload.color}ee, ${projectPayload.secondaryColor} 50%, #0a0a0a 100%)`,
              boxShadow: `0 0 140px ${projectPayload.color}99, inset 0 0 100px ${projectPayload.secondaryColor}55`,
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
