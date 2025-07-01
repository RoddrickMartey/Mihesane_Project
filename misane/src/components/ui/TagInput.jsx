import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import clsx from "clsx";

export default function TagInput({
  label,
  value = [],
  onChange,
  placeholder = "Enter a tag and press Enter",
  max = 6,
  loading = false,
  disabled = false,
  className,
}) {
  const [input, setInput] = useState("");

  const handleAddTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = input.trim().toLowerCase();
      const lowerCaseTags = value.map((t) => t.toLowerCase());
      if (!newTag || lowerCaseTags.includes(newTag) || value.length >= max)
        return;

      onChange([...value, newTag]);
      setInput("");
    }
  };

  const handleRemove = (tagToRemove) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <label className="block mb-1 text-sm font-medium text-text-soft">
          {label}
        </label>
      )}

      {/* Tags above input */}
      {value.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {value.map((tag, i) => (
            <span
              key={i}
              className="flex items-center gap-1 bg-primary text-white text-sm px-2 py-1"
            >
              #{tag}
              {!disabled && (
                <button
                  onClick={() => handleRemove(tag)}
                  className="hover:text-color-accent"
                >
                  <X size={14} />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Input field only (separate box) */}
      {value.length < max && !disabled && (
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder={placeholder}
            disabled={disabled || loading}
            className={clsx(
              (disabled || loading) && "opacity-50 cursor-not-allowed"
            )}
          />
          {loading && (
            <Loader2
              className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-color-primary"
              size={18}
            />
          )}
        </div>
      )}

      <p className="mt-1 text-xs text-text-soft">
        {value.length}/{max} tags
      </p>
    </div>
  );
}
