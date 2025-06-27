import { Info, Check, AlertTriangle, XCircle } from "lucide-react";
import numeral from "numeral";
import clsx from "clsx";

const variants = {
  default: "bg-surface text-text-primary border-border",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-rose-50 text-rose-700 border-rose-200",
};

const icons = {
  default: Info,
  success: Check,
  warning: AlertTriangle,
  danger: XCircle,
};

export default function InfoBox({
  label,
  value = 0,
  variant = "default",
  icon,
  className,
}) {
  const Icon = icon || icons[variant] || Info;

  return (
    <div
      className={clsx(
        "border p-4 rounded-xl flex items-center gap-4 shadow-sm",
        variants[variant],
        className
      )}
    >
      <div className="p-2 rounded-full bg-white/50 dark:bg-black/10">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-lg font-semibold">
          {typeof value === "number" ? numeral(value).format("0,0") : value}
        </p>
      </div>
    </div>
  );
}
