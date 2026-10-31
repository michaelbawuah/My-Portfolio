"use client";
import GlassLiquidButton, { type LiquidButtonProps } from "../glass-carousel/LiquidButton";

type WithVariant<T> = T extends unknown ? Omit<T, "variant"> & { variant?: "primary" | "secondary" | "quiet" } : never;
type Props = WithVariant<LiquidButtonProps>;
/** Keep existing call sites on the shared liquid-fill control. */
export function LiquidButton({ variant = "primary", className = "", ...props }: Props) {
  return <GlassLiquidButton {...props as LiquidButtonProps} variant={variant === "primary" ? "primary" : "ghost"} className={`liquid-button ${className}`} />;
}
