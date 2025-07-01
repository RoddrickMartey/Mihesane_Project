import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import clsx from "clsx";

export default function Input({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  loading = false,
  disabled = false,
  className,
  helperText,
  required = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-text-soft mb-1"
        >
          {label}
          {required && <span className="text-red-600 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled || loading}
          required={required}
          className={clsx(
            (disabled || loading) && "opacity-50 cursor-not-allowed"
          )}
        />

        {/* Password toggle */}
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={togglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-soft hover:text-color-primary"
            disabled={disabled || loading}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {/* Loading Spinner */}
        {loading && !isPassword && (
          <Loader2
            className="animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-color-primary"
            size={18}
          />
        )}
      </div>

      {/* Optional helper text */}
      {helperText && (
        <p className="mt-1 text-xs text-text-soft">{helperText}</p>
      )}
    </div>
  );
}
