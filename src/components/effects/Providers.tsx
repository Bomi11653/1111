"use client";

import { CustomCursor } from "./CustomCursor";
import { FlowingBackground } from "./FlowingBackground";
import { SmoothScroll } from "./SmoothScroll";
import { PageTransitionProvider } from "@/context/PageTransitionContext";
import { LocaleProvider } from "@/context/LocaleContext";
import { ThreeEngineProvider } from "@/context/ThreeEngineContext";
import { ThemeProvider } from "@/lib/color/ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <PageTransitionProvider>
          <ThreeEngineProvider>
            <SmoothScroll>
              <FlowingBackground />
              <CustomCursor />
              {children}
            </SmoothScroll>
          </ThreeEngineProvider>
        </PageTransitionProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
