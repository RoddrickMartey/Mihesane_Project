import React, { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

const categories = [
  "Technology",
  "Health",
  "Education",
  "Travel",
  "Food",
  "Business",
  "Lifestyle",
  "Entertainment",
  "Science",
  "Sports",
];

export default function CategorySelector({
  label = "Select Category",
  value,
  onChange,
  disabled = false,
  className,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return categories.filter((cat) =>
      cat.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <div className={clsx("relative w-full", className)}>
      {label && (
        <label className="block mb-1 text-sm font-medium text-text-soft">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled}
        className={clsx(
          "w-full flex items-center justify-between px-3 py-2 rounded-lg border bg-surface border-border text-text-primary placeholder:text-text-soft focus:outline-none focus:ring-2 focus:ring-primary",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {value || "Choose a category"}
        <ChevronDown size={18} className="text-text-soft ml-2" />
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-full bg-surface border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search category..."
            className="w-full px-3 py-2 border-b border-border text-sm text-text-primary placeholder:text-text-soft outline-none"
          />

          {filtered.length > 0 ? (
            filtered.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onChange(cat);
                  setOpen(false);
                  setQuery("");
                }}
                className={clsx(
                  "block w-full text-left px-3 py-2 text-sm",
                  cat === value
                    ? "bg-primary text-white"
                    : "hover:bg-accent text-text-soft"
                )}
              >
                {cat}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-text-soft italic">
              No matches
            </div>
          )}
        </div>
      )}
    </div>
  );
}
