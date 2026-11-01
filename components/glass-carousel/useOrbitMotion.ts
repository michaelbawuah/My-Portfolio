"use client";
import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { circularDistance } from "./swipe-math";
import { orbitPresence, type OrbitMotion } from "./orbit-motion";

type Options = {
  root: RefObject<HTMLElement | null>; motion: OrbitMotion; count: number;
  running: boolean; enabled: boolean; reduced: boolean; focused: boolean;
  onIndex: (index: number) => void;
};

/** Update only card transforms each frame. React renders when the nearest project changes. */
export default function useOrbitMotion(options: Options) {
  const latest = useRef(options);
  const refresh = useRef<() => void>(() => {});
  useLayoutEffect(() => { latest.current = options; refresh.current(); });

  useEffect(() => {
    const root = options.root.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>(".gc-card"));
    let frame: number | null = null;
    let previous: number | null = null;
    let selected = -1;
    let disposed = false;
    const paint = () => {
      const { count, motion, focused, onIndex } = latest.current;
      const { position, index, progress } = motion.snapshot();
      root.style.setProperty("--gc-progress", progress.toFixed(4));
      root.dataset.orbitPosition = position.toFixed(4);
      for (let k = 0; k < cards.length; k++) {
        const card = cards[k];
        const distance = circularDistance(k, position, count);
        const presence = orbitPresence(distance, count);
        const hidden = presence <= .001 || (focused && k !== index);
        card.style.setProperty("--d", distance.toFixed(4));
        card.style.setProperty("--a", Math.abs(distance).toFixed(4));
        card.style.setProperty("--presence", presence.toFixed(4));
        card.style.zIndex = String(100 - Math.round(Math.abs(distance) * 10));
        card.style.visibility = hidden ? "hidden" : "visible";
        card.style.pointerEvents = hidden ? "none" : "auto";
        card.inert = hidden;
      }
      if (selected !== index) { selected = index; onIndex(index); }
    };
    const tick = (now: number) => {
      frame = null;
      const { motion, running, reduced, enabled } = latest.current;
      if (disposed || !enabled) { previous = null; return; }
      motion.advance(previous === null ? 16 : now - previous, running, reduced);
      previous = now;
      paint();
      if (motion.needsFrame(running, reduced)) frame = requestAnimationFrame(tick);
      else previous = null;
    };
    const wake = () => {
      if (disposed) return;
      const { enabled } = latest.current;
      paint();
      if (!enabled) {
        if (frame !== null) cancelAnimationFrame(frame);
        frame = null; previous = null;
      } else if (frame === null) { previous = null; frame = requestAnimationFrame(tick); }
    };
    refresh.current = wake;
    const unsubscribe = options.motion.subscribe(wake);
    wake();
    return () => {
      disposed = true; unsubscribe(); refresh.current = () => {};
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [options.root, options.motion, options.count]);
}
