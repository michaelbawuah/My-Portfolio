import type { HTMLAttributes } from "react";

/** Shared frosted surface. Content remains readable without backdrop-filter. */
export function GlassPanel({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`glass-panel ${className}`} {...props} />;
}
