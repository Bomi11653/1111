"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { site } from "@/data/site";
import { translations, type Locale, type TranslationKey } from "@/data/i18n";

type LocaleContextValue = {
  locale: Locale;
  t: TranslationKey;
  toggleLocale: () => void;
  setLocale: (locale: Locale) => void;
  siteText: {
    name: string;
    title: string;
    tagline: string;
    headline: string;
  };
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const siteI18n = {
  zh: {
    name: site.name,
    title: site.title,
    tagline: site.tagline,
    headline: site.headline,
  },
  en: {
    name: site.nameEn,
    title: "Game Environment Artist",
    tagline: "3D Environment Art",
    headline: "Crafting immersive game worlds through light, shadow, and detail.",
  },
};

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved === "zh" || saved === "en") setLocaleState(saved);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem("locale", next);
    document.documentElement.lang = next === "zh" ? "zh-CN" : "en";
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
