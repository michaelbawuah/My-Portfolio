"use client";
import GlassCarousel from "../glass-carousel/GlassCarousel";
import type { ShowcaseProject } from "@/lib/project-showcase";

export type CarouselProject = Pick<ShowcaseProject, "slug" | "name" | "summary" | "description" | "category" | "image" | "imageAlt" | "stack">;
type Props = { projects: readonly CarouselProject[]; label?: string; onPreview?: (slug: string, trigger: HTMLButtonElement) => void };

export function ProjectCarousel({ projects, label, onPreview }: Props) {
  const items = projects.map(project => ({ ...project, tagline: project.summary, stack: project.stack, image: project.image || `/logos/${project.slug}.png`, imageAlt: project.imageAlt || `${project.name} identity`, href: `/projects/${project.slug}`, logo: !project.image }));
  return <GlassCarousel key={projects.map(project => project.slug).join(",")} items={items} label={label} onPreview={onPreview} />;
}
