"use client";
import { useRef, useState, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type CSSProperties, type PointerEvent, type ReactNode } from "react";

type Shared = { children: ReactNode; variant?: "primary" | "amber" | "ghost"; size?: "sm" | "md" | "lg"; arrow?: boolean; color?: string; icon?: ReactNode; className?: string; style?: CSSProperties };
type Handled = "onPointerMove" | "onPointerLeave" | "onPointerDown";
export type LiquidButtonProps = Shared & (
  | (Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Shared | Handled> & { href: string })
  | (Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Shared | Handled> & { href?: never })
);
const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function LiquidButton({ href, variant = "primary", size = "md", arrow = false, color, icon, children, className = "", style, ...props }: LiquidButtonProps) {
  const counter = useRef(0);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const move = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || prefersReduced()) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left, y = event.clientY - bounds.top;
    event.currentTarget.style.setProperty("--x", `${x}px`);
    event.currentTarget.style.setProperty("--y", `${y}px`);
    event.currentTarget.style.setProperty("--tx", `${((x / bounds.width - .5) * 10).toFixed(1)}px`);
    event.currentTarget.style.setProperty("--ty", `${((y / bounds.height - .5) * 8).toFixed(1)}px`);
  };
  const leave = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--tx", "0px");
    event.currentTarget.style.setProperty("--ty", "0px");
  };
  const press = (event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0 || prefersReduced()) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const ripple = { id: ++counter.current, x: event.clientX - bounds.left, y: event.clientY - bounds.top, size: Math.max(bounds.width, bounds.height) * 2.4 };
    setRipples(current => [...current.slice(-3), ripple]);
  };
  const shared = {
    className: `lb lb--${variant} lb--${size} ${className}`,
    style: { ...(color ? { "--fill": color } : {}), ...style } as CSSProperties,
    onPointerMove: move, onPointerLeave: leave, onPointerDown: press,
  };
  const content = <>
    <span className="lb__liquid" aria-hidden="true"><i /><i /><i /><i /><i /></span>
    {ripples.map(ripple => <span className="lb__ripple" key={ripple.id} aria-hidden="true" style={{ left: ripple.x, top: ripple.y, width: ripple.size, height: ripple.size }} onAnimationEnd={() => setRipples(current => current.filter(item => item.id !== ripple.id))} />)}
    <span className="lb__label">{children}{icon}{arrow && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>}</span>
  </>;
  if (href !== undefined) {
    const external = /^https?:\/\//.test(href);
    return <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} {...props as AnchorHTMLAttributes<HTMLAnchorElement>} {...shared} draggable={false}>{content}</a>;
  }
  return <button type="button" {...props as ButtonHTMLAttributes<HTMLButtonElement>} {...shared}>{content}</button>;
}
