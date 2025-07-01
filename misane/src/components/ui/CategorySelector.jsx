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
          "border border-secondary focus:outline-none focus:border-2 focus:border-primary placeholder:text-text-soft w-full px-4 py-2 pr-11 bg-surface text-text-primary transition flex items-center justify-between",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {value || "Choose a category"}
        <ChevronDown size={18} className="text-text-soft ml-2" />
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-full bg-surface border border-border shadow-lg max-h-60 overflow-y-auto rounded-md">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search category..."
            className="w-full px-3 py-2 text-sm text-text-primary bg-surface outline-none border-b border-border"
          />

          {filtered.length > 0 ? (
            filtered.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  onChange(cat);
                  setOpen(false);
                  setQuery("");
                }}
                className={clsx(
                  "block w-full text-left px-3 py-2 text-sm transition-colors",
                  cat === value
                    ? "bg-primary text-white"
                    : "hover:bg-accent text-text-soft hover:text-black"
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
