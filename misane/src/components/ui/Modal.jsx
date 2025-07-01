import { useEffect } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  showClose = true,
  footer,
  className,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className={clsx(
          "bg-surface text-text-primary max-w-lg w-full mx-4 shadow-lg relative p-6",
          className
        )}
      >
        {showClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-text-soft hover:text-primary transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {title && <h2 className="text-xl font-heading mb-4">{title}</h2>}

        <div className="mb-2">{children}</div>

        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
}
