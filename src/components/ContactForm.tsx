"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { useLocale } from "@/context/LocaleContext";
import { site } from "@/data/site";

export function ContactForm() {
  const { t } = useLocale();
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = data.get("name") as string;
    const message = data.get("message") as string;
    const email = data.get("email") as string;
    const subject = encodeURIComponent(t.ui.contactSubject.replace("{name}", name));
    const body = encodeURIComponent(
      `${t.ui.contactBodyName}: ${name}\n${t.ui.contactBodyEmail}: ${email}\n\n${message}`,
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setStatus("sent");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="text-xs text-muted uppercase tracking-wider">{t.ui.name}</span>
          <input
            name="name"
            required
            className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:border-accent outline-none transition-colors"
            placeholder={t.ui.namePlaceholder}
          />
        </label>
        <label className="block">
          <span className="text-xs text-muted uppercase tracking-wider">{t.ui.email}</span>
          <input
            name="email"
            type="email"
            required
            className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:border-accent outline-none transition-colors"
            placeholder={t.ui.emailPlaceholder}
          />
        </label>
      </div>
      <label className="block">
        <span className="text-xs text-muted uppercase tracking-wider">{t.ui.message}</span>
        <textarea
          name="message"
          required
          rows={5}
          className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:border-accent outline-none transition-colors resize-y"
          placeholder={t.ui.messagePlaceholder}
        />
      </label>
      <Button type="submit" variant="primary">
        {status === "sent" ? t.ui.mailClientOpened : t.ui.sendMessage}
      </Button>
      <p className="text-xs text-muted">{t.ui.mailClientHint.replace("{email}", site.email)}</p>
    </form>
  );
}
