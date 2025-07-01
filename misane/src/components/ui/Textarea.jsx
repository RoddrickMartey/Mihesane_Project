import React from "react";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

export default function Textarea({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  loading = false,
  disabled = false,
  className,
  helperText,
  rows = 4,
}) {
  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-text-soft mb-1"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled || loading}
          className={clsx(
            (disabled || loading) && "opacity-50 cursor-not-allowed"
          )}
        />

        {/* Loading Spinner */}
        {loading && (
          <Loader2
            className="animate-spin absolute right-3 top-3 text-primary"
            size={18}
          />
        )}
      </div>

      {helperText && (
        <p className="mt-1 text-xs text-text-soft">{helperText}</p>
      )}
    </div>
  );
}
