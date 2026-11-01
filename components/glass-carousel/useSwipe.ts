"use client";
import { useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { createWheelGesture, swipeSteps } from "./swipe-math";

type Gesture = { id: number; x: number; y: number; dx: number; lastX: number; time: number; velocity: number; spacing: number; axis: "x" | "y" | null };
type Options = { stepPx: () => number; onStep: (step: number) => void; disabled?: boolean; reduced?: boolean; onGrab?: () => void; onOffset?: (offset: number) => void; onRelease?: (steps: number, cancelled: boolean) => void };

export default function useSwipe({ stepPx, onStep, disabled = false, reduced = false, onGrab, onOffset, onRelease }: Options) {
  const ref = useRef<HTMLDivElement>(null);
  const gesture = useRef<Gesture | null>(null);
  const frame = useRef<number | null>(null);
  const pending = useRef(0);
  const dragged = useRef(false);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  const reset = useCallback(() => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    setOffset(0);
    setDragging(false);
  }, []);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !event.isPrimary) return;
    dragged.current = false;
    if (disabled) return;
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, lastX: event.clientX, time: performance.now(), velocity: 0, spacing: stepPx(), axis: null };
    onGrab?.();
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = gesture.current;
    if (!current || event.pointerId !== current.id) return;
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    if (current.axis === null && Math.max(Math.abs(dx), Math.abs(dy)) > 6) {
      current.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (current.axis === "y") { gesture.current = null; onRelease?.(0, true); return; }
      event.currentTarget.setPointerCapture(event.pointerId);
      dragged.current = true;
      setDragging(true);
    }
    if (current.axis !== "x") return;
    const now = performance.now();
    current.velocity = .8 * ((event.clientX - current.lastX) / Math.max(1, now - current.time)) + .2 * current.velocity;
    current.time = now;
    current.lastX = event.clientX;
    current.dx = dx;
    pending.current = reduced ? 0 : -dx / current.spacing;
    if (frame.current === null) frame.current = requestAnimationFrame(() => {
      frame.current = null;
      if (onOffset) onOffset(pending.current); else setOffset(pending.current);
    });
  };

  const finish = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    gesture.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    let steps = 0;
    if (current.axis === "x") {
      if (!cancelled) {
        const velocity = performance.now() - current.time < 100 ? current.velocity : 0;
        steps = swipeSteps(current.dx, velocity, current.spacing);
        event.currentTarget.focus({ preventScroll: true });
        if (steps && !onRelease) onStep(steps);
      }
    }
    onRelease?.(steps, cancelled);
    reset();
  };

  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    // Keep the guard until the next pointerdown; delayed touch clicks must not open a link.
    // Keyboard activation has detail === 0 and remains available after a drag.
    if (event.detail > 0 && dragged.current) {
      event.preventDefault(); event.stopPropagation();
    }
  };

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;
    const wheelStep = createWheelGesture();
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      const units = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? el.clientWidth : 1;
      const step = wheelStep(event.deltaX * units, event.deltaY * units, performance.now());
      if (step) onStep(step);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [disabled, onStep]);

  useEffect(() => () => { if (frame.current !== null) cancelAnimationFrame(frame.current); }, []);
  return { ref, offset, dragging, didDrag: () => dragged.current, bind: { onPointerDown, onPointerMove, onPointerUp: (e: PointerEvent<HTMLDivElement>) => finish(e), onPointerCancel: (e: PointerEvent<HTMLDivElement>) => finish(e, true), onLostPointerCapture: (e: PointerEvent<HTMLDivElement>) => finish(e, true), onClickCapture } };
}
