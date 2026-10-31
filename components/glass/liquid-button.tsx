"use client";

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, PointerEvent, ReactNode } from "react";

type Shared = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "quiet";
  className?: string;
  icon?: ReactNode;
};
type PointerProps = "onPointerMove" | "onPointerLeave";
type Props = Shared & (
  | (Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Shared | PointerProps> & { href: string })
  | (Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Shared | PointerProps> & { href?: never })
);

/** Pointer-aware light and a fluid press, with a stable click target and native semantics. */
export function LiquidButton({ children, icon, variant = "primary", className = "", ...props }: Props) {
  function move(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--liquid-x", `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
    event.currentTarget.style.setProperty("--liquid-y", `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
  }
  function reset(event: PointerEvent<HTMLElement>) {
    event.currentTarget.style.removeProperty("--liquid-x");
    event.currentTarget.style.removeProperty("--liquid-y");
  }
  const content = <><span className="liquid-button__fluid" aria-hidden="true" /><span className="liquid-button__content">{children}{icon}</span></>;
  const shared = { className: `liquid-button liquid-button--${variant} ${className}`, onPointerMove: move, onPointerLeave: reset };
  if (props.href !== undefined) return <a {...props} {...shared}>{content}</a>;
  return <button type="button" {...props} {...shared}>{content}</button>;
}
