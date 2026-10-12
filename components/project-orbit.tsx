"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight, Pause, Play, Sparkles } from "lucide-react";
import { showcaseProjects, type ShowcaseProject } from "@/lib/project-showcase";
import styles from "./project-orbit.module.css";

const FULL_TURN = Math.PI * 2;
const REVOLUTION_MS = 110_000;
const INITIAL_ANGLE = -Math.PI / 2;

function projectLogo(project: ShowcaseProject) {
  if (project.slug === "pro-competitive-programming") return "/tech/cplusplus.svg";
  return project.logo || project.cardLogo || `/logos/${project.slug}.png`;
}

function projectLabel(project: ShowcaseProject) {
  return project.slug === "pro-competitive-programming" ? "C++ Library" : project.name;
}

function initialPosition(index: number): CSSProperties {
  const angle = INITIAL_ANGLE + (FULL_TURN * index) / showcaseProjects.length;
  return {
    "--orbit-cos": Math.cos(angle),
    "--orbit-sin": Math.sin(angle),
  } as CSSProperties;
}

/** Upright, real project links revolve around the portrait; approaching a link stops the orbit. */
export function ProjectOrbit() {
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLAnchorElement | null)[]>([]);
  const angle = useRef(INITIAL_ANGLE);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [visible, setVisible] = useState(true);
  const [staticGrid, setStaticGrid] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(preference.matches);
    const syncVisibility = () => setHidden(document.hidden);
    syncPreference();
    syncVisibility();
    setReady(true);
    preference.addEventListener("change", syncPreference);
    document.addEventListener("visibilitychange", syncVisibility);

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.08 },
    );
    if (stage.current) observer.observe(stage.current);
    const resize = new ResizeObserver(([entry]) => setStaticGrid(entry.contentRect.width < 280));
    if (stage.current) resize.observe(stage.current);
    return () => {
      preference.removeEventListener("change", syncPreference);
      document.removeEventListener("visibilitychange", syncVisibility);
      observer.disconnect();
      resize.disconnect();
    };
  }, []);

  const moving = ready && !reducedMotion && !staticGrid && !userPaused && !hovered && !focused && !hidden && visible;

  useEffect(() => {
    if (!moving) return;
    let frame = 0;
    let previous: number | null = null;
    const draw = (time: number) => {
      const elapsed = previous === null ? 0 : Math.min(time - previous, 40);
      previous = time;
      angle.current = (angle.current + (elapsed * FULL_TURN) / REVOLUTION_MS) % FULL_TURN;
      cards.current.forEach((card, index) => {
        if (!card) return;
        const position = angle.current + (FULL_TURN * index) / showcaseProjects.length;
        card.style.setProperty("--orbit-cos", String(Math.cos(position)));
        card.style.setProperty("--orbit-sin", String(Math.sin(position)));
      });
      frame = window.requestAnimationFrame(draw);
    };
    frame = window.requestAnimationFrame(draw);
    return () => window.cancelAnimationFrame(frame);
  }, [moving]);

  return (
    <div className={styles.stage} ref={stage} data-orbit-moving={moving ? "true" : "false"}>
      <div className={styles.heading}>
        <span><Sparkles size={14} aria-hidden="true" /> A WORLD OF IDEAS</span>
        <span className={styles.projectCount}>{showcaseProjects.length} projects · explore an orbit</span>
      </div>

      <div
        className={styles.field}
        onPointerEnter={(event) => { if (event.pointerType !== "touch") setHovered(true); }}
        onPointerLeave={() => setHovered(false)}
        onPointerDownCapture={(event) => { if (event.pointerType === "touch") setUserPaused(true); }}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
        }}
      >
        <div className={styles.halo} aria-hidden="true" />
        <div className={styles.outerRing} aria-hidden="true" />
        <div className={styles.innerRing} aria-hidden="true" />
        <div className={styles.crosshair} aria-hidden="true" />
        <span className={`${styles.spark} ${styles.sparkOne}`} aria-hidden="true" />
        <span className={`${styles.spark} ${styles.sparkTwo}`} aria-hidden="true" />
        <span className={`${styles.spark} ${styles.sparkThree}`} aria-hidden="true" />

        <a
          className={styles.portrait}
          href="/about"
          aria-label="Meet Michael Baffour Awuah — read my story"
        >
          <span className={styles.portraitCorner} aria-hidden="true" />
          <div className={styles.photo}>
            <img
              src="/personal/michael-landing-atrium.webp"
              alt="Michael Baffour Awuah smiling in a decorated black suit and glasses"
              width={1147}
              height={1372}
              fetchPriority="high"
            />
          </div>
          <span className={styles.portraitCaption}>
            <span><strong>Michael</strong><small>MBA~STEINS</small></span>
            <span className={styles.story}>My story <ArrowUpRight size={14} aria-hidden="true" /></span>
          </span>
        </a>

        <nav className={styles.projects} aria-label="Explore my projects around the portrait">
          {showcaseProjects.map((project, index) => (
            <a
              key={project.slug}
              ref={(node) => { cards.current[index] = node; }}
              className={styles.project}
              href={`/projects/${project.slug}`}
              style={initialPosition(index)}
              data-accent={project.accent}
              aria-label={`Explore ${project.name} — ${project.type}`}
            >
              <span className={styles.projectLogo}>
                <img src={projectLogo(project)} alt="" width={34} height={34} />
              </span>
              <span className={styles.projectCopy}>
                <strong>{projectLabel(project)}</strong>
                <small>{project.category}</small>
              </span>
              <ArrowUpRight className={styles.projectArrow} size={12} aria-hidden="true" />
            </a>
          ))}
        </nav>
      </div>

      <div className={styles.controls}>
        <span className={styles.hint}>
          <span className={styles.statusDot} aria-hidden="true" />
          {staticGrid ? "Choose a project. Follow the idea." : reducedMotion ? "Still view · reduced motion" : hovered || focused ? "Paused while you explore" : userPaused ? "Orbit paused · choose a project" : "Choose a project. Follow the idea."}
        </span>
        <button
          type="button"
          className={styles.motionButton}
          onClick={() => setUserPaused((paused) => !paused)}
          aria-pressed={userPaused}
          disabled={reducedMotion || staticGrid}
          title={staticGrid ? "Projects use a readable grid on very small screens" : reducedMotion ? "Orbit motion follows your device’s reduced-motion preference" : undefined}
        >
          {userPaused || reducedMotion || staticGrid ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
          {staticGrid ? "Still view" : reducedMotion ? "Motion reduced" : userPaused ? "Resume orbit" : "Pause orbit"}
        </button>
      </div>
    </div>
  );
}
