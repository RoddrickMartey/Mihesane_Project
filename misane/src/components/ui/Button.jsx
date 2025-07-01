import { Loader2 } from "lucide-react";
import clsx from "clsx";

/**
 * Reusable Button Component
 *
 * Props:
 * - variant: "primary" | "secondary" | "outline" | "warning" | "danger"
 * - type: "button" | "submit" | "reset"
 * - icon: ReactNode (optional)
 * - iconPosition: "left" | "right"
 * - loading: boolean
 * - disabled: boolean
 * - className: string (for additional styling)
 * - children: ReactNode (label/text)
 */
export default function Button({
  variant = "primary",
  type = "button",
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  className,
  children,
  ...restProps // 👈 rename to avoid confusion
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium text-sm px-4 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-primary text-white hover:brightness-90 focus-visible:ring-primary",
    secondary:
      "bg-secondary text-white hover:brightness-90 focus-visible:ring-secondary",
    outline:
      "border border-border text-text-primary hover:bg-surface focus-visible:ring-border",
    warning:
      "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500",
    danger: "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500",
  };

  const content = (
    <>
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && icon && iconPosition === "left" && icon}
      <span>{children}</span>
      {!loading && icon && iconPosition === "right" && icon}
    </>
  );

  // Only spread restProps after removing non-DOM ones
  return (
    <button
      type={type}
      className={clsx(base, variants[variant], className)}
      disabled={disabled || loading}
      {...restProps}
    >
      {content}
    </button>
  );
}
