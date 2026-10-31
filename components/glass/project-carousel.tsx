"use client";

import {
  useEffect, useId, useRef, useState,
  type CSSProperties, type KeyboardEvent, type PointerEvent,
} from "react";
import { AnimatePresence, motion, useInView, useReducedMotion, useSpring } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Maximize2, Minimize2, MoveHorizontal, Pause, Play } from "lucide-react";
import type { ShowcaseProject } from "@/lib/project-showcase";
import { LiquidButton } from "./liquid-button";
import { CarouselStageCard, projectPalette, projectImage } from "./carousel-stage-card";
import styles from "./project-carousel.module.css";

export type CarouselProject = Pick<ShowcaseProject,
  "slug" | "name" | "summary" | "description" | "category" | "image" | "imageAlt" | "stack"
>;
type Props = {
  projects: readonly CarouselProject[];
  label?: string;
  onPreview?: (slug: string, trigger: HTMLButtonElement) => void;
};
type Gesture = { id: number; x: number; y: number; time: number; distance: number; dragging: boolean };
const TOUR_INTERVAL = 6000;
const wrap = (index: number, length: number) => ((index % length) + length) % length;

/** A circular, spatial gallery. Motion values keep pointer updates outside React renders. */
export function ProjectCarousel({ projects, label = "Selected project carousel", onPreview }: Props) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const dock = useRef<HTMLDivElement>(null);
  const gesture = useRef<Gesture | null>(null);
  const dragged = useRef(false);
  const [selected, setSelected] = useState(0);
  const [focused, setFocused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const reduced = useReducedMotion();
  const inView = useInView(root, { amount: 0.35 });
  const entered = useInView(root, { amount: 0.12, once: true });
  const drag = useSpring(0, { stiffness: 320, damping: 32 });
  const active = projects[Math.min(selected, projects.length - 1)];
  const running = playing && inView && pageVisible && !hovered && !focused && !reduced;

  function select(index: number, automatic = false) {
    if (!projects.length) return;
    if (!automatic) setPlaying(false);
    setSelected(wrap(index, projects.length));
    drag.set(0);
  }

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    if (!running || projects.length < 2) return;
    const timer = window.setTimeout(() => {
      setSelected(index => wrap(index + 1, projects.length));
    }, TOUR_INTERVAL);
    return () => window.clearTimeout(timer);
  }, [running, selected, projects.length]);

  useEffect(() => {
    // Scroll only the thumbnail dock; never move the visitor's page position.
    const container = dock.current;
    const button = container?.children[selected] as HTMLElement | undefined;
    if (!container || !button) return;
    container.scrollTo({
      left: button.offsetLeft - container.offsetLeft - (container.clientWidth - button.clientWidth) / 2,
      behavior: reduced ? "instant" : "smooth",
    });
  }, [selected, reduced]);

  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === "ArrowRight") select(selected + 1);
    else if (event.key === "ArrowLeft") select(selected - 1);
    else if (event.key === "Home") select(0);
    else if (event.key === "End") select(projects.length - 1);
    else if (event.key === "Escape" && focused) setFocused(false);
    else return;
    event.preventDefault();
    if (stage.current?.contains(event.target as Node)) stage.current.focus({ preventScroll: true });
  }

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || !event.isPrimary || focused || projects.length < 2) return;
    dragged.current = false;
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, time: performance.now(), distance: 0, dragging: false };
  }

  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    const current = gesture.current;
    if (current?.id === event.pointerId) {
      const dx = event.clientX - current.x;
      const dy = event.clientY - current.y;
      // Let the browser keep native vertical scrolling on touchscreens.
      if (!current.dragging && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) {
        gesture.current = null;
        return;
      }
      if (!current.dragging && Math.abs(dx) > 8) {
        current.dragging = true;
        dragged.current = true;
        setPlaying(false);
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.dataset.dragging = "true";
      }
      if (current.dragging) {
        current.distance = dx;
        drag.set(reduced ? 0 : Math.max(-180, Math.min(180, dx * 0.6)));
      }
    }
    if (reduced || event.pointerType !== "mouse" || focused) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    event.currentTarget.style.setProperty("--pointer-x", `${x * 100}%`);
    event.currentTarget.style.setProperty("--pointer-y", `${y * 100}%`);
    event.currentTarget.style.setProperty("--tilt-x", `${(0.5 - y) * 9}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${(x - 0.5) * 12}deg`);
  }

  function finishGesture(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    gesture.current = null;
    event.currentTarget.dataset.dragging = "false";
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    const velocity = current.distance / Math.max(performance.now() - current.time, 1);
    if (!cancelled && current.dragging && (Math.abs(current.distance) > 45 || Math.abs(velocity) > 0.4)) {
      event.currentTarget.focus({ preventScroll: true });
      select(selected + (current.distance < 0 ? 1 : -1));
    }
    drag.set(0);
  }

  if (!active) return null;
  const palette = projectPalette(active.slug);
  const colors = { "--exhibit-accent": palette[0], "--exhibit-secondary": palette[1] } as CSSProperties;

  return (
    <div
      ref={root}
      className={styles.carousel}
      style={colors}
      data-focused={focused}
      data-visible={inView}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={keyboard}
      onFocusCapture={event => {
        if (!(event.target as HTMLElement).closest("[data-tour-control]")) setPlaying(false);
      }}
    >
      <div className={styles.header}>
        <div className={styles.signature}><span className={styles.statusLight} /><span>THE PROJECT ATLAS</span><span className={styles.edition}>VOL. 01 — SELECTED BUILDS</span></div>
        <div className={styles.modeControls}>
          <button type="button" data-tour-control aria-label={playing ? "Pause project tour" : "Play project tour"} aria-pressed={playing} disabled={!!reduced || projects.length < 2} onClick={() => { setFocused(false); setPlaying(value => !value); }}>
            {playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
            <span>{playing ? "Pause tour" : "Play tour"}</span>
          </button>
          <button type="button" aria-pressed={focused} aria-label={focused ? "Exit focus view" : "Enlarge project visual"} onClick={() => { setPlaying(false); setFocused(value => !value); }}>
            {focused ? <Minimize2 size={15} aria-hidden="true" /> : <Maximize2 size={15} aria-hidden="true" />}
            <span>{focused ? "Back to deck" : "Focus view"}</span>
          </button>
        </div>
      </div>

      <div
        ref={stage}
        id={id}
        className={styles.stage}
        tabIndex={0}
        aria-label="Project stage. Drag horizontally, or use left and right arrow keys to browse."
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={event => finishGesture(event)}
        onPointerCancel={event => finishGesture(event, true)}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={event => {
          setHovered(false);
          event.currentTarget.style.setProperty("--tilt-x", "0deg");
          event.currentTarget.style.setProperty("--tilt-y", "0deg");
        }}
        onClickCapture={event => {
          if (dragged.current) { event.preventDefault(); event.stopPropagation(); dragged.current = false; }
        }}
      >
        <div className={styles.atmosphere} aria-hidden="true"><i /><i /><i /></div>
        <div className={styles.grid} aria-hidden="true" />
        <div className={styles.orbit} aria-hidden="true" />
        <span className={styles.stageIndex} aria-hidden="true">{String(selected + 1).padStart(2, "0")}</span>
        <div className={styles.floor} aria-hidden="true" />
        <motion.div className={styles.deck} style={{ x: drag }}>
          {projects.map((project, index) => {
            let offset = wrap(index - selected, projects.length);
            if (offset > projects.length / 2) offset -= projects.length;
            return (
              <CarouselStageCard
                key={project.slug}
                project={project}
                index={index}
                offset={offset}
                total={projects.length}
                entered={entered}
                focused={focused}
                reduced={!!reduced}
                onSelect={() => {
                  if (index === selected) { setPlaying(false); setFocused(value => !value); }
                  else select(index);
                }}
              />
            );
          })}
        </motion.div>
        <div className={styles.stageCaption} aria-hidden="true">
          <span><MoveHorizontal size={15} />{focused ? "A closer look. Every detail matters." : "DRAG TO DISCOVER"}</span>
          <span>{focused ? "ESC TO RETURN" : "CLICK A CARD TO BRING IT FORWARD"}</span>
        </div>
      </div>

      <div className={styles.story}>
        <div className={styles.storyCopy}>
          <div className={styles.chapter}><span>{active.category}</span><span className={styles.chapterLine} /><span aria-live="polite" aria-atomic="true">{String(selected + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span></div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.slug}
              initial={reduced ? false : { opacity: 0, y: 18, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12, filter: "blur(4px)" }}
              transition={{ duration: reduced ? 0 : 0.24 }}
            >
              <h3>{active.name}<span>.</span></h3>
              <p className={styles.summary}>{active.summary}</p>
            </motion.div>
          </AnimatePresence>
          <div className={styles.technologies} aria-label="Technologies">{active.stack.slice(0, 4).map(tool => <span key={tool}>{tool}</span>)}</div>
        </div>
        <div className={styles.storyActions}>
          <p>{active.description}</p>
          <div className={styles.actions}>
            <LiquidButton href={`/projects/${active.slug}`} icon={<ArrowUpRight size={18} aria-hidden="true" />}>Explore {active.name === "Pro Competitive Programming" ? "the collection" : active.name}</LiquidButton>
            {onPreview && <LiquidButton variant="quiet" onClick={event => onPreview(active.slug, event.currentTarget)}>Quick preview</LiquidButton>}
          </div>
        </div>
      </div>

      <div className={styles.navigation}>
        <button type="button" className={styles.arrow} aria-label="Previous project slide" aria-controls={id} disabled={projects.length < 2} onClick={() => select(selected - 1)}><ArrowLeft size={21} aria-hidden="true" /></button>
        <div className={styles.dock} ref={dock} role="group" aria-label="Choose a project">
          {projects.map((project, index) => (
            <button key={project.slug} type="button" aria-label={`Show ${project.name}`} aria-current={index === selected ? "true" : undefined} onClick={() => select(index)} className={styles.thumbnail}>
              <span className={styles.thumbnailImage}><img src={projectImage(project)} alt="" width={96} height={64} loading="lazy" /><span>{String(index + 1).padStart(2, "0")}</span></span>
              <span className={styles.thumbnailName}>{project.name === "Pro Competitive Programming" ? "C++ collection" : project.name}</span>
              {index === selected && <motion.span className={styles.selection} layoutId={`${id}-selection`} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 280, damping: 28 }} />}
            </button>
          ))}
        </div>
        <button type="button" className={styles.arrow} aria-label="Next project slide" aria-controls={id} disabled={projects.length < 2} onClick={() => select(selected + 1)}><ArrowRight size={21} aria-hidden="true" /></button>
      </div>
      <div className={styles.tourTrack} aria-hidden="true">{running && <motion.span key={selected} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: TOUR_INTERVAL / 1000, ease: "linear" }} />}</div>
      <div className={styles.footer}><span>DESIGNED, BUILT & DOCUMENTED</span><span>{reduced ? "Reduced motion" : playing ? hovered ? "Tour paused while you explore" : "Guided tour" : "Your pace. Your curiosity."}</span></div>
    </div>
  );
}
