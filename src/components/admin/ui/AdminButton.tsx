import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "./cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none outline-none focus-visible:ring-1 focus-visible:ring-white/30",
  {
    variants: {
      variant: {
        primary:
          "bg-white text-black hover:bg-white/90 border border-white/10",
        secondary:
          "bg-[var(--admin-panel-soft)] text-[var(--admin-text)] border border-[var(--admin-border)] hover:bg-white/[0.06] hover:border-[var(--admin-border-strong)]",
        ghost:
          "bg-transparent text-[var(--admin-muted)] hover:text-[var(--admin-text)] hover:bg-white/[0.04]",
        outline:
          "bg-transparent text-[var(--admin-text)] border border-[var(--admin-border)] hover:border-[var(--admin-border-strong)] hover:bg-white/[0.03]",
        danger:
          "bg-transparent text-[var(--admin-danger)] border border-red-500/20 hover:bg-red-500/10 hover:border-red-500/35",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-[var(--admin-radius-sm)]",
        md: "h-9 px-4 text-sm rounded-[var(--admin-radius-sm)]",
        lg: "h-10 px-5 text-sm rounded-[var(--admin-radius-sm)]",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  },
);

export type AdminButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export const AdminButton = forwardRef<HTMLButtonElement, AdminButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
AdminButton.displayName = "AdminButton";

export { buttonVariants };
