"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Layers3, Scan } from "lucide-react";
import type { CSSProperties } from "react";
import type { CarouselProject } from "./project-carousel";
import styles from "./project-carousel.module.css";

const palettes: Record<string, readonly [string, string]> = {
  navox: ["#43dec5", "#ffb64e"],
  fluxion: ["#9caaff", "#49ddc5"],
  gatehaven: ["#ffbf63", "#63dcc4"],
  ledger: ["#50dfbd", "#ffba56"],
  modelforge: ["#ffbd67", "#93a3ff"],
  marketlab: ["#79e6bf", "#ffca75"],
  toolret: ["#a4b1ff", "#64e0ce"],
  slopechat: ["#ffd094", "#70e0c7"],
  "pro-competitive-programming": ["#a8b3ff", "#ffd18b"],
};
export const projectPalette = (slug: string) => palettes[slug] || palettes.navox;
export const projectImage = (project: CarouselProject) => project.image || `/logos/${project.slug}.png`;

type Props = {
  project: CarouselProject;
  index: number;
  offset: number;
  total: number;
  entered: boolean;
  focused: boolean;
  reduced: boolean;
  onSelect: () => void;
};

/** The card shell moves through space; the inner glass responds independently to the pointer. */
export function CarouselStageCard({ project, index, offset, total, entered, focused, reduced, onSelect }: Props) {
  const active = offset === 0;
  const distance = Math.abs(offset);
  const visible = distance < 3 && (!focused || active);
  const palette = projectPalette(project.slug);
  const colors = { "--card-accent": palette[0], "--card-secondary": palette[1] } as CSSProperties;
  const spread = entered ? focused ? 90 : 62 : 7;

  return (
    <motion.div
      className={styles.cardPosition}
      style={{ zIndex: 20 - distance, pointerEvents: visible && distance < 2 ? "auto" : "none" }}
      initial={false}
      animate={{
        x: `${-50 + offset * spread}%`,
        y: `${active ? -50 : -46}%`,
        rotateY: reduced || focused ? 0 : -Math.sign(offset) * Math.min(distance, 2) * 25,
        rotateZ: reduced || focused ? 0 : Math.sign(offset) * Math.min(distance, 2) * 5,
        scale: active ? 1 : Math.max(0.45, 1 - distance * 0.22),
        opacity: visible ? active ? 1 : entered ? distance === 1 ? 0.66 : 0.24 : 0 : 0,
      }}
      transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 125, damping: 23, mass: 0.9 }}
      data-active={active}
      aria-hidden={!visible || distance > 1}
      inert={!visible || distance > 1}
    >
      <button
        type="button"
        className={styles.card}
        style={colors}
        data-active={active}
        data-logo={!project.image}
        data-portrait={project.slug === "navox"}
        aria-label={active ? focused ? `Return ${project.name} to the project deck` : `Enlarge ${project.name} project visual` : `Bring ${project.name} forward`}
        tabIndex={active ? 0 : -1}
        onClick={onSelect}
      >
        <span className={styles.cardEdge} aria-hidden="true" />
        <span className={styles.cardReflection} aria-hidden="true" />
        <span className={styles.cardToolbar}><span><i /><i /><i /></span><span>{project.slug} / project view</span><Scan size={15} aria-hidden="true" /></span>
        <span className={styles.cardVisual}>
          <span className={styles.visualHalo} aria-hidden="true" />
          <img src={projectImage(project)} alt={project.imageAlt || `${project.name} identity`} width={1200} height={800} loading={distance <= 1 ? "eager" : "lazy"} draggable={false} />
          <span className={styles.cardLens} aria-hidden="true"><Layers3 size={17} /><span>{project.category}</span></span>
          <span className={styles.cardFocus} aria-hidden="true">{focused ? "RETURN TO DECK" : "TAKE A CLOSER LOOK"}<ArrowUpRight size={15} /></span>
        </span>
        <span className={styles.cardFoot}><strong>{project.name}</strong><span>{String(index + 1).padStart(2, "0")} <i>/</i> {String(total).padStart(2, "0")}</span></span>
      </button>
    </motion.div>
  );
}
