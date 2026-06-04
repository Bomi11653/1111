"use client";

import { createContext, useCallback, useContext, useEffect, useState, startTransition } from "react";
import { site } from "@/data/site";
import { siteLocales, type SiteLocaleContent } from "@/data/siteLocales";
import { translations, type Locale, type TranslationKey } from "@/data/i18n";

type LocaleContextValue = {
  locale: Locale;
  t: TranslationKey;
  toggleLocale: () => void;
  setLocale: (locale: Locale) => void;
  siteText: SiteLocaleContent;
  site: typeof site;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function persistLocale(next: Locale) {
  localStorage.setItem("locale", next);
  document.documentElement.lang = next === "zh" ? "zh-CN" : "en";
  document.cookie = `locale=${next};path=/;max-age=31536000;sameSite=lax`;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    const next = saved === "en" ? "en" : "zh";
    startTransition(() => {
      setLocaleState(next);
    });
    persistLocale(next);
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
        siteText: siteLocales[locale],
        site,
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
