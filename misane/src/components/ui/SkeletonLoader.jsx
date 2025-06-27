import clsx from "clsx";

export default function SkeletonLoader({
  className = "",
  width = "w-full",
  height = "h-4",
  rounded = "rounded-md",
}) {
  return (
    <div className={clsx("skeleton", width, height, rounded, className)} />
  );
}
