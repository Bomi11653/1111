"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

export default function NotFound() {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-lg px-6 py-32 text-center">
      <h1 className="font-display text-4xl text-foreground">{t.ui.pageNotFound}</h1>
      <Link href="/" className="mt-6 inline-block text-accent hover:underline">
        {t.ui.backHome}
      </Link>
    </div>
  );
}
