import clsx from "clsx";

export default function Spinner({ size = "md", className = "" }) {
  const sizeMap = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-4",
    xl: "w-14 h-14 border-4",
    biiiiig: "w-24 h-24 border-[6px]", // 🌀 for real
  };

  return (
    <div
      className={clsx(
        "spinner border-zinc-300 border-t-primary",
        sizeMap[size] || sizeMap.md,
        className
      )}
    />
  );
}
