"use client";

import { useLocale } from "@/context/LocaleContext";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className={`inline-flex items-center rounded-full border border-border/60 p-0.5 text-[10px] tracking-widest ${className}`}
      role="group"
      aria-label="Language"
    >
      {(["zh", "en"] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLocale(lang)}
          className={`rounded-full px-3 py-1.5 transition-colors duration-300 ${
            locale === lang
              ? "bg-accent/15 text-accent"
              : "text-muted hover:text-foreground"
          }`}
          data-cursor="hover"
        >
          {lang === "zh" ? "中" : "EN"}
        </button>
      ))}
    </div>
  );
}
