"use client";

/** Adapted from React Bits Magnet. Copyright (c) 2026 David Haz.
 * See ./LICENSE.md. Uses bounded, frame-coalesced DOM updates instead of mousemove state.
 */
import { useEffect, useRef, type ReactNode, type PointerEvent } from "react";

export default function Magnet({ children, strength = 6, className = '' }: {
  children: ReactNode; strength?: number; className?: string;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const allowed = useRef(false);

  const reset = () => {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    wrapper.current?.style.setProperty('--magnet-x', '0px');
    wrapper.current?.style.setProperty('--magnet-y', '0px');
  };

  useEffect(() => {
    const query = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const change = () => { allowed.current = query.matches; if (!query.matches) reset(); };
    change();
    query.addEventListener('change', change);
    return () => { query.removeEventListener('change', change); cancelAnimationFrame(frame.current); };
  }, []);

  function move(event: PointerEvent<HTMLDivElement>) {
    if (!allowed.current || event.pointerType !== 'mouse') return;
    const x = event.clientX, y = event.clientY;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const root = wrapper.current;
      if (!root || root.querySelector(':focus-visible')) return;
      const { left, top, width, height } = root.getBoundingClientRect();
      const clamp = (value: number) => Math.max(-8, Math.min(8, value));
      root.style.setProperty('--magnet-x', `${clamp((x - left - width / 2) / Math.max(1, strength))}px`);
      root.style.setProperty('--magnet-y', `${clamp((y - top - height / 2) / Math.max(1, strength))}px`);
    });
  }

  return <div ref={wrapper} className={`magnet ${className}`} onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset} onFocusCapture={reset}>
    <div className="magnet-content">{children}</div>
  </div>;
}
