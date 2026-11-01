"use client";

import { useEffect, useRef, type CSSProperties, type HTMLAttributes, type PointerEvent } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Code2, FlaskConical, MessageCircle, UserRound } from "lucide-react";
import GlassCarousel from "@/components/glass-carousel/GlassCarousel";
import Orb from "@/components/glass-carousel/Orb";
import { showcaseProjects } from "@/lib/project-showcase";

/** A shared surface: pointer light on desktop, stable geometry on touch. */
export function GlassSurface({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const frame = useRef(0);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const element = event.currentTarget, bounds = element.getBoundingClientRect();
    const x = event.clientX - bounds.left, y = event.clientY - bounds.top;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      element.style.setProperty("--light-x", `${x}px`);
      element.style.setProperty("--light-y", `${y}px`);
    });
  };
  return <div {...props} className={`inner-glass ${className}`} onPointerMove={move} onPointerLeave={() => cancelAnimationFrame(frame.current)}>{children}</div>;
}

export function InteriorAtmosphere() {
  return <div className="inner-atmosphere" aria-hidden="true"><div className="inner-grid"/><i/><i/><i/></div>;
}

const destinations = [
  { href: "/work", label: "THE BUILDS", title: "Ideas, in motion.", text: "Explore the products and the systems behind them.", icon: Code2, color: "var(--glass-teal)" },
  { href: "/research", label: "THE QUESTIONS", title: "Follow the evidence.", text: "Methods, measurements, and work you can reproduce.", icon: FlaskConical, color: "var(--glass-indigo)" },
  { href: "/about", label: "THE PERSON", title: "Beyond the code.", text: "Engineering, cadet life, and a creative point of view.", icon: UserRound, color: "var(--glass-amber)" },
  { href: "/contact", label: "THE NEXT CHAPTER", title: "Start with hello.", text: "A role, a collaboration, or a question worth exploring.", icon: MessageCircle, color: "var(--glass-teal)" },
];

export function PageJourney() {
  const pathname = usePathname();
  if (pathname.startsWith("/projects/")) {
    const index = showcaseProjects.findIndex(project => pathname === `/projects/${project.slug}`);
    const related = Array.from({ length: 3 }, (_, i) => showcaseProjects[(Math.max(index, 0) + i + 1) % showcaseProjects.length]);
    return <section className="inner-related" aria-labelledby="inner-related-heading">
      <div className="inner-section-heading"><div><span className="mono">THE NEXT BUILD</span><h2 id="inner-related-heading">Keep your<br/><em>curiosity moving.</em></h2></div><a className="text-link" href="/work">All projects <ArrowUpRight size={17}/></a></div>
      <GlassCarousel syncAccent={false} label="Explore another project" items={related.map(project => ({ ...project, tagline: project.summary, href: `/projects/${project.slug}`, image: project.image || `/logos/${project.slug}.png`, logo: !project.image }))}/>
    </section>;
  }
  const links = destinations.filter(item => item.href !== pathname && !(item.href === "/about" && pathname.startsWith("/about/"))).slice(0,3);
  return <section className="inner-journey" aria-label="Continue exploring">
    <div className="inner-section-heading"><div><span className="mono">THERE’S MORE TO THE STORY</span><h2>Where to <em>next?</em></h2></div><span className="journey-orb"><Orb variant="ring" color="var(--glass-amber)" size="var(--journey-orb-size,70px)"/></span></div>
    <div className="inner-journey-grid">{links.map(({href,label,title,text,icon:Icon,color}) => <a key={href} href={href} className="inner-journey-card" style={{"--journey-accent":color} as CSSProperties}><div><Icon size={23}/><ArrowUpRight size={20}/></div><span className="mono">{label}</span><h3>{title}</h3><p>{text}</p><span className="journey-line" aria-hidden="true"/></a>)}</div>
  </section>;
}
