"use client";

import { createContext, useCallback, useContext, useEffect, useState, startTransition } from "react";
import type { HomeContent, ModulesContent, SiteContent } from "@/lib/cms-types";
import { translations, type Locale, type TranslationKey } from "@/data/i18n";

type LocaleContextValue = {
  locale: Locale;
  t: TranslationKey;
  toggleLocale: () => void;
  setLocale: (locale: Locale) => void;
  site: SiteContent;
  home: HomeContent;
  modules: ModulesContent;
  siteText: {
    name: string;
    title: string;
    tagline: string;
    headline: string;
  };
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function buildSiteI18n(site: SiteContent, home: HomeContent) {
  return {
    zh: {
      name: site.name,
      title: site.title,
      tagline: site.tagline,
      headline: site.headline,
    },
    en: {
      name: site.nameEn,
      title: home.hero.subtitleEn,
      tagline: home.hero.taglineEn,
      headline: home.hero.headlineEn,
    },
  };
}

function persistLocale(next: Locale) {
  localStorage.setItem("locale", next);
  document.documentElement.lang = next === "zh" ? "zh-CN" : "en";
  document.cookie = `locale=${next};path=/;max-age=31536000;sameSite=lax`;
}

export function LocaleProvider({
  children,
  site,
  home,
  modules,
}: {
  children: React.ReactNode;
  site: SiteContent;
  home: HomeContent;
  modules: ModulesContent;
}) {
  const [locale, setLocaleState] = useState<Locale>("zh");
  const siteI18n = buildSiteI18n(site, home);

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved === "zh" || saved === "en") {
      startTransition(() => {
        setLocaleState(saved);
      });
      persistLocale(saved);
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    persistLocale(next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "zh" ? "en" : "zh");
  }, [locale, setLocale]);

  return (
    <LocaleContext.Provider
      value={{
        locale,
        t: translations[locale],
        toggleLocale,
        setLocale,
        site,
        home,
        modules,
        siteText: siteI18n[locale],
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
