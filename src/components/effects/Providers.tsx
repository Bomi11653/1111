"use client";

import { usePathname } from "next/navigation";
import type { HomeContent, ModulesContent, SiteContent } from "@/lib/cms-types";
import { CustomCursor } from "./CustomCursor";
import { FlowingBackground } from "./FlowingBackground";
import { SmoothScroll } from "./SmoothScroll";
import { PageTransitionProvider } from "@/context/PageTransitionContext";
import { LocaleProvider } from "@/context/LocaleContext";
import { ThreeEngineProvider } from "@/context/ThreeEngineContext";
import { ThemeProvider } from "@/lib/color/ThemeProvider";

type Props = {
  children: React.ReactNode;
  site: SiteContent;
  home: HomeContent;
  modules: ModulesContent;
};

function SiteProviders({ children }: { children: React.ReactNode }) {
  return (
    <PageTransitionProvider>
      <ThreeEngineProvider>
        <SmoothScroll>
          <FlowingBackground />
          <CustomCursor />
          {children}
        </SmoothScroll>
      </ThreeEngineProvider>
    </PageTransitionProvider>
  );
}

export function Providers({ children, site, home, modules }: Props) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <ThemeProvider>
      <LocaleProvider site={site} home={home} modules={modules}>
        {isAdmin ? children : <SiteProviders>{children}</SiteProviders>}
      </LocaleProvider>
    </ThemeProvider>
  );
}

export function SiteChrome({
  children,
  header,
  footer,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="relative z-10 flex flex-col min-h-full">
      {header}
      <main className="flex-1">{children}</main>
      {footer}
    </div>
  );
}
