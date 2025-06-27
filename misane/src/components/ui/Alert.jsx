import { useState } from "react";
import { Info, CheckCircle, AlertTriangle, XCircle, X } from "lucide-react";
import clsx from "clsx";

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

const baseColors = {
  info: "bg-blue-50 text-blue-700 border-blue-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  error: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function Alert({
  type = "info",
  message,
  description,
  dismissible = false,
  className,
}) {
  const [visible, setVisible] = useState(true);
  const Icon = icons[type] || Info;

  if (!visible) return null;

  return (
    <div
      className={clsx(
        "rounded-xl border p-4 flex items-start gap-3 text-sm",
        baseColors[type],
        className
      )}
    >
      <div className="mt-0.5">
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <p className="font-semibold">{message}</p>
        {description && <p className="text-sm opacity-80">{description}</p>}
      </div>
      {dismissible && (
        <button
          onClick={() => setVisible(false)}
          className="text-inherit hover:opacity-60 transition"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
