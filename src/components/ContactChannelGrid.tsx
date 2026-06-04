"use client";

import { motion } from "framer-motion";
import { GlobeIcon, MailIcon, PlayIcon } from "@/components/icons/ContactIcons";
import { useLocale } from "@/context/LocaleContext";
import { site } from "@/data/site";

type Channel = {
  id: string;
  label: string;
  subtitle: string;
  href: string;
  external?: boolean;
  icon: React.ReactNode;
};

export function ContactGreeting() {
  const { t } = useLocale();

  return (
    <motion.header
      className="mb-14 md:mb-20 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <h1 className="font-serif text-4xl md:text-6xl text-foreground tracking-tight">
        {t.contact.greeting}
      </h1>
      <p className="mt-4 text-muted text-base md:text-lg">{t.contact.subgreeting}</p>
    </motion.header>
  );
}

export function ContactChannelGrid() {
  const { t, siteText } = useLocale();

  const channels: Channel[] = [
    {
      id: "email",
      label: t.ui.emailLabel,
      subtitle: site.email,
      href: `mailto:${site.email}`,
      icon: <MailIcon />,
    },
    {
      id: "bilibili",
      label: "Bilibili",
      subtitle: siteText.name,
      href: site.social.bilibili.url,
      external: true,
      icon: <PlayIcon />,
    },
    {
      id: "ggac",
      label: "GGAC",
      subtitle: siteText.name,
      href: site.social.ggac.url,
      external: true,
      icon: <GlobeIcon />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 max-w-3xl mx-auto">
      {channels.map((ch, i) => (
        <motion.a
          key={ch.id}
          href={ch.href}
          target={ch.external ? "_blank" : undefined}
          rel={ch.external ? "noopener noreferrer" : undefined}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="contact-card group flex flex-col items-center justify-center text-center min-h-[160px] p-8 rounded-2xl border border-border/50 bg-surface/40 hover:border-accent/50 hover:bg-surface/70 transition-all duration-500"
          style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
          data-cursor="hover"
        >
          <span className="text-muted group-hover:text-accent transition-colors duration-500 mb-5">
            {ch.icon}
          </span>
          <span className="font-serif text-lg text-foreground">{ch.label}</span>
          <span className="text-sm text-muted mt-2 group-hover:text-foreground/80 transition-colors truncate max-w-full">
            {ch.subtitle}
          </span>
        </motion.a>
      ))}
    </div>
  );
}
