import Link from "next/link";
import { type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-background hover:bg-accent-dim border border-accent/30",
  secondary:
    "bg-surface-elevated text-foreground border border-border hover:border-accent/50",
  ghost: "text-muted hover:text-accent border border-transparent",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  external,
  onClick,
  type = "button",
}: {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    const isExternal = external || href.startsWith("http") || href.startsWith("mailto:");
    if (isExternal) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
