"use client";
import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight, Maximize2, Minimize2, Pause, Play } from "lucide-react";
import Orb, { orbFor, type OrbStyle } from "./Orb";
import LiquidButton from "./LiquidButton";
import useSwipe from "./useSwipe";
import { circularDistance } from "./swipe-math";

export type CarouselItem = {
  slug: string; name: string; category: string; tagline: string; description: string;
  stack: readonly string[]; image: string; imageAlt: string; href: string; thumb?: string;
  orb?: Partial<OrbStyle>; logo?: boolean;
};
type Props = { items: readonly CarouselItem[]; interval?: number; label?: string; onPreview?: (slug: string, trigger: HTMLButtonElement) => void };
const pad = (n: number) => String(n).padStart(2, "0");
const wrap = (n: number, count: number) => count ? ((n % count) + count) % count : 0;

export default function GlassCarousel({ items, interval = 6000, label = "Selected project carousel", onPreview }: Props) {
  const id = useId();
  const root = useRef<HTMLElement>(null);
  const pointerFocus = useRef(false);
  const pourAnimations = useRef<Animation[]>([]);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const n = items.length;
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [pageVisible, setPageVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const activeIndex = Math.min(index, Math.max(0, n - 1));
  const active = items[activeIndex];
  const duration = Math.max(3000, interval);

  const select = useCallback((next: number) => { setIndex(wrap(next, n)); }, [n]);
  const step = useCallback((direction: number) => { setIndex(current => wrap(current + direction, n)); }, [n]);
  const stepPx = useCallback(() => {
    if (!root.current) return 320;
    const size = Math.max(150, Math.min(330, window.innerWidth * .3));
    return Number.isFinite(size) && size > 0 ? size : 320;
  }, []);
  const swipe = useSwipe({ stepPx, onStep: step, disabled: n < 2 || focused, reduced });
  const running = !paused && !hovered && !swipe.dragging && !reduced && !focused && expandedSlug !== active?.slug && pageVisible && visible && n > 1;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => { setReduced(media.matches); if (media.matches) setPaused(true); };
    const updateVisibility = () => setPageVisible(!document.hidden);
    const keyboardInput = () => { pointerFocus.current = false; };
    updateMotion(); updateVisibility();
    media.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    // Tab can enter from outside the carousel, so track keyboard input at the document.
    document.addEventListener("keydown", keyboardInput, true);
    return () => { media.removeEventListener("change", updateMotion); document.removeEventListener("visibilitychange", updateVisibility); document.removeEventListener("keydown", keyboardInput, true); };
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .15 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setIndex(current => wrap(current + 1, n)), duration);
    return () => window.clearTimeout(timer);
  }, [running, index, n, duration]);


  useEffect(() => () => { pourAnimations.current.forEach(animation => animation.cancel()); }, [activeIndex]);

  const pour = (target: HTMLElement) => {
    if (reduced) return;
    const card = target.closest<HTMLElement>(".gc-card.is-active");
    const surface = card?.querySelector<HTMLElement>(".gc-card-surface");
    const orb = card?.querySelector<HTMLElement>(".gc-orb");
    const drop = card?.querySelector<HTMLElement>(".gc-pour-drop");
    const button = target.querySelector<HTMLElement>(".lb");
    if (!surface || !orb || !drop || !button) return;
    pourAnimations.current.forEach(animation => animation.cancel());
    const bounds = surface.getBoundingClientRect(), start = orb.getBoundingClientRect(), end = button.getBoundingClientRect();
    const x = start.left + start.width * .72 - bounds.left;
    const y = start.top + start.height * .72 - bounds.top;
    drop.style.left = `${x}px`; drop.style.top = `${y}px`;
    const dx = end.right - bounds.left - 16 - x, dy = end.top + end.height * .5 - bounds.top - y;
    pourAnimations.current = [
      orb.animate([{ scale: "1", rotate: "0deg" }, { scale: ".86 1.14", rotate: "-12deg", offset: .3 }, { scale: "1", rotate: "0deg" }], { duration: 800, easing: "cubic-bezier(.2,.85,.25,1)" }),
      drop.animate([{ opacity: 0, transform: "translate(0,0) scale(.3)" }, { opacity: .9, transform: `translate(${dx * .1}px,${dy * .05}px) scale(.8,1.4)`, offset: .22 }, { opacity: .85, transform: `translate(${dx}px,${dy}px) scale(.65,1.5)`, offset: .82 }, { opacity: 0, transform: `translate(${dx}px,${dy}px) scale(2.2,.2)` }], { duration: 800, easing: "cubic-bezier(.35,0,.65,1)" }),
    ];
  };

  const keyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === "ArrowRight") step(1);
    else if (event.key === "ArrowLeft") step(-1);
    else if (event.key === "Home") select(0);
    else if (event.key === "End") select(n - 1);
    else return;
    setPaused(true);
    event.preventDefault();
    swipe.ref.current?.focus({ preventScroll: true });
  };

  const move = (event: PointerEvent<HTMLDivElement>) => {
    swipe.bind.onPointerMove(event);
    if (event.pointerType !== "mouse" || reduced || focused) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    event.currentTarget.style.setProperty("--px", x.toFixed(3));
    event.currentTarget.style.setProperty("--py", y.toFixed(3));
    event.currentTarget.style.setProperty("--gc-angle", `${Math.round(Math.atan2(y, x) * 180 / Math.PI + 90)}deg`);
  };

  if (!active) return null;
  const activeOrb = orbFor(active);
  return <section ref={root} className={`gc ${running ? "" : "is-paused"} ${paused ? "is-user-paused" : ""}`} aria-roledescription="carousel" aria-label={label}
    data-focused={focused} data-visible={visible} data-page-visible={pageVisible}
    style={{ "--gc-accent": activeOrb.color, "--gc-dur": `${duration}ms` } as CSSProperties}
    onPointerEnter={e => { if (e.pointerType === "mouse") setHovered(true); }}
    onPointerLeave={e => { if (e.pointerType === "mouse") setHovered(false); }}
    onPointerDownCapture={e => { pointerFocus.current = true; if (e.pointerType !== "mouse") setHovered(false); }}
    onFocusCapture={e => { if (!pointerFocus.current && !(e.target as HTMLElement).closest("[data-rotation-control]")) setPaused(true); }}
    onKeyDownCapture={e => { if (!(e.target as HTMLElement).closest("[data-rotation-control]")) setPaused(true); }}
    onKeyDown={e => { if (e.key === "Escape" && focused) { setFocused(false); e.preventDefault(); swipe.ref.current?.focus({ preventScroll: true }); } }}>

    <div className="gc-viewport">
      <div className="gc-atmosphere" aria-hidden="true"><i /><i /><i /></div>
      <div {...swipe.bind} ref={swipe.ref} id={id} className={`gc-stage ${swipe.dragging ? "is-dragging" : ""}`} tabIndex={0}
        role="group" aria-label="Project stage. Drag horizontally, or use left and right arrow keys to browse."
        onDragStart={event => event.preventDefault()}
        onKeyDown={keyboard} onPointerMove={move} onPointerLeave={e => { e.currentTarget.style.setProperty("--px", "0"); e.currentTarget.style.setProperty("--py", "0"); }}>
        {items.map((project, k) => {
          const distance = circularDistance(k, activeIndex + swipe.offset, n);
          const absolute = Math.abs(distance);
          const isActive = k === activeIndex;
          const hidden = absolute > 2.6 || (focused && !isActive);
          const orb = orbFor(project);
          return <article key={project.slug} className={`gc-card ${isActive ? "is-active" : "is-side"}`} aria-hidden={!isActive} inert={hidden}
            data-logo={project.logo} data-portrait={project.slug === "navox"}
            style={{ "--card-accent": orb.color, "--d": distance.toFixed(3), "--a": absolute.toFixed(3), zIndex: 100 - Math.round(absolute * 10), visibility: hidden ? "hidden" : "visible", pointerEvents: hidden ? "none" : "auto" } as CSSProperties}>
            <div className="gc-card-surface gc-glass">
              <div className="gc-visual">
                <button type="button" className="gc-frame" tabIndex={isActive ? 0 : -1}
                  aria-label={isActive ? focused ? `Return ${project.name} to the project deck` : `Enlarge ${project.name} project visual` : `Bring ${project.name} forward`}
                  onClick={() => { if (isActive) setFocused(current => !current); else select(k); swipe.ref.current?.focus({ preventScroll: true }); }}>
                  <span className="gc-shot"><img src={project.image} alt={project.imageAlt} width={1200} height={800} draggable={false} loading={absolute < 1.5 ? "eager" : "lazy"} decoding="async" /></span>
                  <span className="gc-image-hint" aria-hidden="true"><Maximize2 size={14} />A closer look</span>
                </button>
                <span className="gc-orb-anchor"><Orb variant={orb.variant} color={orb.color} size="var(--gc-orb-size)" /></span>
              </div>
              <div className="gc-card-copy">
                <div className="gc-eyebrow"><span>{project.category}</span><span className="gc-card-count">{pad(k + 1)} / {pad(n)}</span></div>
                <h3 className="gc-title">{project.name}<span className="gc-title__dot">.</span></h3>
                <p className="gc-tagline">{project.tagline}</p>
                <p id={`${id}-${project.slug}-description`} className={`gc-description ${isActive && expandedSlug === project.slug ? "is-expanded" : ""}`}>{project.description}</p>
                <button type="button" className="gc-more" aria-controls={`${id}-${project.slug}-description`} aria-expanded={isActive && expandedSlug === project.slug} tabIndex={isActive ? 0 : -1} onClick={() => { setExpandedSlug(current => current === project.slug ? null : project.slug); }}>{isActive && expandedSlug === project.slug ? "Show less" : "Read more"}</button>
                <ul className="gc-stack" aria-label="Technologies">{project.stack.map(tech => <li key={tech}>{tech}</li>)}</ul>
                <div className="gc-actions" onPointerEnter={event => { if (event.pointerType === "mouse" && isActive) pour(event.currentTarget); }} onFocusCapture={event => { if (isActive) pour(event.currentTarget); }}><LiquidButton href={project.href} arrow color={orb.color} tabIndex={isActive ? 0 : -1} aria-label={`Explore ${project.name}`}>Open case study</LiquidButton>{onPreview && <LiquidButton variant="ghost" tabIndex={isActive ? 0 : -1} onClick={event => onPreview(project.slug, event.currentTarget)}>Quick preview</LiquidButton>}</div>
              </div>
              <span className="gc-pour-drop" aria-hidden="true" />
            </div>
            {!isActive && !hidden && <button className="gc-bring-forward" type="button" tabIndex={-1} aria-label={`Bring ${project.name} forward`} onClick={() => { select(k); swipe.ref.current?.focus({ preventScroll: true }); }} />}
          </article>;
        })}
      </div>
    </div>
    <p className="gc-hint">{focused ? "A closer look · Escape returns to the deck" : "Swipe, drag, or use ← → to explore"}</p>
    <span className="sr-only" aria-live={running ? "off" : "polite"} aria-atomic="true">{active.name}, project {activeIndex + 1} of {n}</span>
    <div className="gc-controls">
      <div className="gc-pagination"><LiquidButton variant="ghost" className="gc-round" aria-label="Previous project" disabled={n < 2} onClick={() => step(-1)}><ArrowLeft aria-hidden="true" /></LiquidButton>
        <div className="gc-dots" role="group" aria-label="Choose a project">{items.map((project, k) => <button type="button" key={project.slug} aria-label={`Show ${project.name}`} aria-pressed={k === activeIndex} aria-controls={id} className={k === activeIndex ? "is-on" : ""} style={{ "--dot-color": orbFor(project).color } as CSSProperties} onClick={() => select(k)}><span><i key={`${active.slug}-${running}`} /></span></button>)}</div>
        <LiquidButton variant="ghost" className="gc-round" aria-label="Next project" disabled={n < 2} onClick={() => step(1)}><ArrowRight aria-hidden="true" /></LiquidButton>
      </div>
      <span className="gc-deck-count" aria-hidden="true">{pad(activeIndex + 1)} <span>/ {pad(n)} projects</span></span>
      <div className="gc-mode-controls">
        <LiquidButton variant="ghost" size="sm" data-rotation-control aria-label={paused ? "Play project tour" : "Pause project tour"} aria-pressed={!paused} disabled={reduced || n < 2} onClick={() => { setFocused(false); setPaused(current => !current); }} icon={paused ? <Play size={14} /> : <Pause size={14} />}><span>{paused ? "Play" : "Pause"}</span></LiquidButton>
        <LiquidButton variant="ghost" size="sm" aria-label={focused ? "Exit focus view" : "Enlarge project visual"} aria-pressed={focused} onClick={() => { setFocused(current => !current); }} icon={focused ? <Minimize2 size={14} /> : <Maximize2 size={14} />}><span>{focused ? "Back to deck" : "Focus view"}</span></LiquidButton>
      </div>
    </div>
  </section>;
}
