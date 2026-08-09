import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium tracking-wide uppercase",
  {
    variants: {
      variant: {
        published: "border-white/20 bg-white/10 text-white/80",
        draft: "border-[var(--admin-border)] bg-[var(--admin-panel-soft)] text-[var(--admin-subtle)]",
        featured: "border-white/25 bg-white/[0.08] text-white/75",
        hidden: "border-[var(--admin-border)] bg-transparent text-[var(--admin-subtle)]",
        danger: "border-red-500/25 bg-red-500/10 text-red-300",
        neutral: "border-[var(--admin-border)] bg-[var(--admin-panel-soft)] text-[var(--admin-muted)]",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

type Props = VariantProps<typeof badgeVariants> & {
  children: React.ReactNode;
  className?: string;
};

export function AdminBadge({ variant, children, className }: Props) {
  return <span className={cn(badgeVariants({ variant }), className)}>{children}</span>;
}
