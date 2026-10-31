"use client";
import { useEffect, useState, type RefObject } from "react";
import { createPourEngine, type PourPhase } from "./pour-engine";

type Options = {
  rootRef: RefObject<HTMLElement | null>; sourceRef: RefObject<HTMLElement | null>;
  ctaRef: RefObject<HTMLAnchorElement | null>; resetKey: string; disabled?: boolean; reduced?: boolean;
};
export default function usePour({ rootRef, sourceRef, ctaRef, resetKey, disabled, reduced }: Options) {
  const [view, setView] = useState<{ phase: PourPhase; flying: boolean }>({ phase: "parked", flying: false });
  const [engine] = useState(() => createPourEngine({ rootRef, sourceRef, ctaRef, onChange: (phase, flying) => setView({ phase, flying }) }));
  useEffect(() => {
    engine.activate();
    const reset = () => engine.reset();
    window.addEventListener("resize", reset, { passive: true });
    return () => { window.removeEventListener("resize", reset); engine.dispose(); };
  }, [engine]);
  useEffect(() => { engine.reset(); }, [engine, resetKey, disabled, reduced]);
  return { ...engine, ...view, busy: view.phase !== "parked", handlers: disabled ? {} : engine.handlers };
}
