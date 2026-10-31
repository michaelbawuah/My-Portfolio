import type { FocusEvent, MouseEvent, PointerEvent, RefObject } from "react";

export type PourPhase = "parked" | "falling" | "filled" | "rising";
type Options = {
  rootRef: RefObject<HTMLElement | null>;
  sourceRef: RefObject<HTMLElement | null>;
  ctaRef: RefObject<HTMLAnchorElement | null>;
  onChange: (phase: PourPhase, flying: boolean) => void;
  autoDrainMs?: number;
};

/** Adapted from the supplied usePour. Capture nodes so a project change restores the departing orb. */
export function createPourEngine({ rootRef, sourceRef, ctaRef, onChange, autoDrainMs = 2900 }: Options) {
  const travRef: { current: HTMLSpanElement | null } = { current: null };
  let phase: PourPhase = "parked", want: "parked" | "filled" = "parked";
  let source: HTMLElement | null = null, cta: HTMLAnchorElement | null = null;
  let sourceVisibility = "", hovered = false, keyboardFocused = false, touchArmed = false;
  let replaying = false, alive = true, generation = 0, size = 64, impactX = 0, endScale = .4;
  let flight: Animation | null = null, autoDrain: ReturnType<typeof setTimeout> | undefined;
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const frames = new Set<number>();
  const animations = new Set<Animation>();
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches || !travRef.current?.animate;
  const ready = () => !!(rootRef.current && sourceRef.current && ctaRef.current && travRef.current);
  const T = (x: number, y: number, sx: number, sy: number, r: number) => `translate(${x}px, ${y}px) scale(${sx}, ${sy}) rotate(${r}deg)`;
  const change = (next: PourPhase, flying = next !== "parked") => {
    phase = next;
    if (cta) cta.dataset.pourState = next;
    if (alive) onChange(next, flying);
  };
  const later = (fn: () => void, ms: number) => {
    const token = generation;
    const timer = setTimeout(() => { timers.delete(timer); if (alive && token === generation) fn(); }, ms);
    timers.add(timer); return timer;
  };
  const frame = (fn: () => void) => {
    const token = generation;
    const id = requestAnimationFrame(() => { frames.delete(id); if (alive && token === generation) fn(); });
    frames.add(id);
  };
  const animate = (el: HTMLElement, keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
    const animation = el.animate(keyframes, options); animations.add(animation); return animation;
  };
  const stop = (animation: Animation | null) => {
    if (!animation) return;
    animation.onfinish = null; animation.cancel(); animations.delete(animation);
  };
  const parts = () => ({
    blobs: [...cta!.querySelectorAll<HTMLElement>(".pour__blob")],
    drop: cta!.querySelector<HTMLElement>(".pour__drop")!,
    splash: [...cta!.querySelectorAll<HTMLElement>(".pour__splash")],
  });
  const rel = (el: HTMLElement) => {
    const r = el.getBoundingClientRect(), o = rootRef.current!.getBoundingClientRect();
    return { x: r.left - o.left, y: r.top - o.top, w: r.width, h: r.height };
  };
  const restoreSource = () => { if (source) source.style.visibility = sourceVisibility; };
  const cancelAutoDrain = () => { if (autoDrain !== undefined) { clearTimeout(autoDrain); timers.delete(autoDrain); autoDrain = undefined; } };

  function settle() {
    if (!alive || !ready()) return;
    if (want === "filled" && phase === "parked") pour();
    else if (want === "parked" && phase === "filled") drain();
  }
  function updateWish() {
    want = hovered || keyboardFocused || replaying ? "filled" : "parked";
    settle();
  }
  function scheduleDrain() {
    if (!replaying) return;
    cancelAutoDrain();
    autoDrain = later(() => { autoDrain = undefined; replaying = false; updateWish(); }, autoDrainMs);
  }
  function pour() {
    source = sourceRef.current; cta = ctaRef.current;
    sourceVisibility = source!.style.visibility;
    impactX = cta!.getBoundingClientRect().width * .42;
    change("falling", !reduced());
    if (reduced()) { impact(); return; }
    // Allow React to mount the traveler's orb before starting its flight.
    frame(() => frame(() => {
      if (phase !== "falling" || !ready()) return;
      const a = rel(source!), b = rel(cta!), trav = travRef.current!;
      if (!a.w || !b.w) { impact(); return; }
      size = a.w; impactX = b.w * .42; endScale = b.h * .62 / size;
      trav.style.setProperty("--pour-size", `${size}px`); trav.style.opacity = "1";
      source!.style.visibility = "hidden";
      const x = b.x + impactX - size / 2, y = b.y - size / 2, dx = x - a.x, dy = y - a.y;
      stop(flight);
      flight = animate(trav, [
        { transform: T(a.x,a.y,1,1,0), easing: "cubic-bezier(.3,0,.5,1)" },
        { transform: T(a.x+dx*.04,a.y-26,1.08,.92,-10), offset: .2, easing: "cubic-bezier(.4,0,.8,.5)" },
        { transform: T(a.x+dx*.55,a.y+Math.min(-34,dy*.05),.75,.75,80), offset: .55, easing: "cubic-bezier(.55,0,1,1)" },
        { transform: T(x,y,endScale*1.3,endScale*.7,150) },
      ], { duration: 860, fill: "forwards" });
      flight.onfinish = () => { trav.style.opacity = "0"; impact(); };
    }));
  }
  function impact() {
    if (!cta || !alive || phase !== "falling") return;
    const { blobs, drop, splash } = parts(), b = cta.getBoundingClientRect();
    blobs.forEach(el => {
      const r = el.getBoundingClientRect(), mid = r.left - b.left + r.width / 2;
      el.style.transitionDelay = `${Math.abs(mid - impactX) / Math.max(1,b.width) * .35}s`;
    });
    cta.classList.add("is-filled", "is-impact");
    if (reduced()) { change("filled", false); scheduleDrain(); settle(); return; }
    drop.style.left = `${impactX-15}px`;
    animate(drop, [{ transform: "translateY(-30px) scale(1)", opacity: 1 }, { transform: `translateY(${b.height*.55}px) scale(1.7)`, opacity: 1 }], { duration: 420, easing: "cubic-bezier(.5,0,1,1)", fill: "forwards" });
    splash.forEach((el,k) => {
      const off = [-26,22,-6][k], up = [-6,-2,-12][k];
      el.style.left = `${impactX-4+off*.3}px`;
      animate(el, [
        { transform: `translate(0,${b.height*.45}px) scale(.6)`, opacity: 0 },
        { transform: `translate(${off}px,${up}px) scale(1)`, opacity: 1, offset: .45 },
        { transform: `translate(${off*1.5}px,${b.height*.6}px) scale(.4)`, opacity: 1 },
      ], { duration: 700, delay: 140, easing: "cubic-bezier(.2,.7,.5,1)", fill: "forwards" });
    });
    later(() => { change("filled"); scheduleDrain(); settle(); }, 840);
  }
  function drain() {
    if (!cta) return;
    change("rising");
    const { blobs, drop } = parts();
    blobs.forEach((el,k) => { el.style.transitionDelay = `${k*.03}s`; });
    cta.classList.remove("is-filled", "is-impact");
    if (reduced()) { park(); return; }
    const bh = cta.getBoundingClientRect().height;
    animations.forEach(animation => { if (animation !== flight) stop(animation); });
    animate(drop, [{ transform: `translateY(${bh*.55}px) scale(1.7)`, opacity: 1 }, { transform: "translateY(-40px) scale(1)", opacity: 1 }], { duration: 380, easing: "cubic-bezier(.2,.6,.4,1)", fill: "forwards" });
    later(() => {
      if (!ready() || phase !== "rising") return;
      const a = rel(source!), b = rel(cta!), trav = travRef.current!;
      const x = b.x+impactX-size/2, y = b.y-size/2, dx = a.x-x, dy = a.y-y;
      trav.style.opacity = "1"; stop(flight);
      flight = animate(trav, [
        { transform: T(x,y,endScale*.8,endScale*1.25,150), easing: "cubic-bezier(.2,.6,.3,1)" },
        { transform: T(x+dx*.45,y+dy*.62-40,.8,.8,60), offset: .5, easing: "cubic-bezier(.3,.7,.4,1)" },
        { transform: T(a.x,a.y-10,1.07,.95,-6), offset: .82, easing: "cubic-bezier(.4,0,.4,1)" },
        { transform: T(a.x,a.y,1,1,0) },
      ], { duration: 900, fill: "forwards" });
      animate(drop, [{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" });
      flight.onfinish = park;
    }, 260);
  }
  function park() {
    animations.forEach(stop); flight = null;
    if (travRef.current) travRef.current.style.opacity = "0";
    restoreSource(); change("parked", false); settle();
  }
  function reset(notify = true) {
    generation++;
    timers.forEach(clearTimeout); timers.clear(); autoDrain = undefined;
    frames.forEach(cancelAnimationFrame); frames.clear();
    animations.forEach(stop); flight = null;
    hovered = keyboardFocused = replaying = touchArmed = false;
    want = "parked"; phase = "parked";
    restoreSource();
    if (travRef.current) travRef.current.style.opacity = "0";
    if (cta) { cta.classList.remove("is-filled", "is-impact"); cta.dataset.pourState = "parked"; parts().blobs.forEach(el => { el.style.transitionDelay = ""; }); }
    source = null; cta = null;
    if (notify && alive) onChange("parked", false);
  }
  function replay() {
    replaying = true; cancelAutoDrain(); updateWish();
    if (phase === "filled") scheduleDrain();
  }
  const handlers = {
    onPointerEnter: (e: PointerEvent<HTMLAnchorElement>) => { if (e.pointerType === "mouse") { hovered = true; updateWish(); } },
    onPointerLeave: (e: PointerEvent<HTMLAnchorElement>) => { if (e.pointerType === "mouse") { hovered = false; updateWish(); } },
    onFocus: (e: FocusEvent<HTMLAnchorElement>) => { if (e.currentTarget.matches(":focus-visible")) { keyboardFocused = true; updateWish(); } },
    onBlur: () => { keyboardFocused = false; updateWish(); },
    onPointerDown: (e: PointerEvent<HTMLAnchorElement>) => { touchArmed = e.pointerType !== "mouse" && phase !== "filled"; },
    onClick: (e: MouseEvent<HTMLAnchorElement>) => {
      const preview = touchArmed; touchArmed = false;
      // Preserve keyboard activation and modified clicks. Stage click-capture owns swipe suppression.
      if (preview && e.detail > 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) { e.preventDefault(); keyboardFocused = false; replay(); }
    },
  };
  return { travRef, handlers, replay, reset, activate: () => { alive = true; }, dispose: () => { alive = false; reset(false); } };
}
