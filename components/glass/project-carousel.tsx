"use client";

import { useCallback, useEffect, useId, useState, type KeyboardEvent } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, ArrowUpRight, MoveHorizontal } from "lucide-react";
import type { ShowcaseProject } from "@/lib/project-showcase";
import { LiquidButton } from "./liquid-button";

export type CarouselProject = Pick<ShowcaseProject, "slug" | "name" | "summary" | "description" | "category" | "image" | "imageAlt" | "stack">;
type Props = { projects: readonly CarouselProject[]; label?: string; onPreview?: (slug: string, trigger: HTMLButtonElement) => void };

/** One shared carousel for the homepage and the filterable Work collection. */
export function ProjectCarousel({ projects, label = "Selected project carousel", onPreview }: Props) {
  const id = useId();
  const [viewport, api] = useEmblaCarousel({ align: "start", loop: false, duration: 32, breakpoints: { "(prefers-reduced-motion: reduce)": { duration: 0 } } });
  const [selected, setSelected] = useState(0);
  const [canPrevious, setCanPrevious] = useState(false);
  const [canNext, setCanNext] = useState(projects.length > 1);
  const synchronize = useCallback(() => {
    if (!api) return;
    setSelected(api.selectedScrollSnap());
    setCanPrevious(api.canScrollPrev());
    setCanNext(api.canScrollNext());
  }, [api]);
  useEffect(() => {
    if (!api) return;
    synchronize();
    api.on("select", synchronize).on("reInit", synchronize);
    return () => { api.off("select", synchronize).off("reInit", synchronize); };
  }, [api, synchronize]);

  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === "ArrowRight") api?.scrollNext();
    else if (event.key === "ArrowLeft") api?.scrollPrev();
    else if (event.key === "Home") api?.scrollTo(0);
    else if (event.key === "End") api?.scrollTo(projects.length - 1);
    else return;
    event.preventDefault();
  }
  if (!projects.length) return null;

  return <div className="glass-carousel" role="region" aria-roledescription="carousel" aria-label={label} onKeyDown={navigate}>
    <div className="glass-carousel-viewport" ref={viewport} id={id} tabIndex={0} aria-label="Project slides. Use left and right arrow keys to browse.">
      <div className="glass-carousel-track">
        {projects.map((project, index) => <div key={project.slug} className="glass-carousel-slide" role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${projects.length}: ${project.name}`} inert={index !== selected}>
          <article className="glass-project">
            <div className="glass-project-copy"><div className="glass-project-kicker"><span>{project.category}</span><span>{String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span></div><h3>{project.name}<span>.</span></h3><p className="glass-project-summary">{project.summary}</p><p className="glass-project-description">{project.description}</p><div className="glass-project-stack" aria-label="Technologies">{project.stack.slice(0, 4).map(tool => <span key={tool}>{tool}</span>)}</div><div className="glass-project-actions"><LiquidButton href={`/projects/${project.slug}`} icon={<ArrowUpRight size={18} aria-hidden="true" />}>Explore the project</LiquidButton>{onPreview && <LiquidButton variant="quiet" onClick={event => onPreview(project.slug, event.currentTarget)}>Quick preview</LiquidButton>}</div></div>
            <a className={`glass-project-media ${!project.image ? "glass-project-media--logo" : ""}`} href={`/projects/${project.slug}`} aria-label={`Read the ${project.name} case study`} tabIndex={-1}><div className="glass-media-toolbar"><span aria-hidden="true"><i /><i /><i /></span><span>{project.name.toLowerCase()} / project view</span><ArrowUpRight size={14} aria-hidden="true" /></div><div className="glass-media-image"><img src={project.image || `/logos/${project.slug}.png`} alt={project.imageAlt || `${project.name} identity`} width={1200} height={800} loading={index === 0 ? "eager" : "lazy"} draggable={false} /></div><span className="glass-media-caption">{project.image ? "Explore the full case study for context and evidence." : "Source, design and implementation in the case study."}</span></a>
          </article>
        </div>)}
      </div>
    </div>
    <div className="glass-carousel-controls"><span className="glass-swipe-hint"><MoveHorizontal size={16} aria-hidden="true" /> Swipe or use the arrows</span><div className="glass-carousel-dots" role="group" aria-label="Choose a project">{projects.map((project, index) => <button type="button" key={project.slug} onClick={() => api?.scrollTo(index)} aria-label={`Show ${project.name}`} aria-current={selected === index ? "true" : undefined}><span /></button>)}</div><div className="glass-carousel-arrows"><span className="glass-slide-count" aria-live="polite" aria-atomic="true">{String(selected + 1).padStart(2, "0")} <span>/ {String(projects.length).padStart(2, "0")}</span></span><LiquidButton variant="secondary" aria-label="Previous project slide" aria-controls={id} disabled={!canPrevious} onClick={() => api?.scrollPrev()}><ArrowLeft size={19} aria-hidden="true" /></LiquidButton><LiquidButton variant="secondary" aria-label="Next project slide" aria-controls={id} disabled={!canNext} onClick={() => api?.scrollNext()}><ArrowRight size={19} aria-hidden="true" /></LiquidButton></div></div>
  </div>;
}
