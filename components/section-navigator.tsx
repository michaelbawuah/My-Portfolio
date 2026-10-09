"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";

import { scrollToPortfolioSection } from "@/lib/portfolio-scroll";

type ReadingSection = { id: string; label: string; content: ReactNode };

/** Tab-shaped chapter links: every chapter stays in the document. */
export function SectionNavigator({ sections, label = "Page sections", id, className = "", initialSection }: {
  sections: readonly ReadingSection[]; label?: string; id?: string; className?: string; initialSection?: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const navigation = useRef<HTMLElement>(null);
  const [active, setActive] = useState(sections[0].id);
  const sectionKey = sections.map(section => section.id).join("|");

  useEffect(() => {
    const element = container.current, nav = navigation.current;
    if (!element || !nav) return;
    const root = element.closest<HTMLElement>("[data-section-scroll-root]");
    const header = root?.querySelector<HTMLElement>(".preview-dialog-header") ?? document.querySelector<HTMLElement>(".site-nav");
    const panels = Array.from(element.querySelectorAll<HTMLElement>(":scope > [data-scroll-section]"));
    let frame = 0;
    const measure = () => {
      element.style.setProperty("--chapter-top", `${(header?.offsetHeight ?? 0) + 8}px`);
      element.style.setProperty("--chapter-offset", `${(header?.offsetHeight ?? 0) + nav.offsetHeight + 24}px`);
    };
    const update = () => {
      frame = 0;
      const scrollPadding = parseFloat(getComputedStyle(root ?? document.documentElement).scrollPaddingTop) || 0;
      const line = (root?.getBoundingClientRect().top ?? 0) + (header?.offsetHeight ?? 0) + nav.offsetHeight + scrollPadding + 40;
      let current: string | undefined = panels[0]?.id;
      for (const panel of panels) if (panel.getBoundingClientRect().top <= line) current = panel.id;
      const atBottom = root
        ? root.scrollTop + root.clientHeight >= root.scrollHeight - 4
        : window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
      if (atBottom) current = panels.at(-1)?.id;
      if (current) setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(() => { measure(); schedule(); });
    resize.observe(nav);
    resize.observe(element);
    if (header) resize.observe(header);
    const scroller = root ?? window;
    scroller.addEventListener("scroll", schedule, { passive: true });
    const restore = () => {
      if (root) return;
      let hash = "";
      try { hash = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
      const legacyToolkit = initialSection && new URLSearchParams(window.location.search).get("view") === "toolkit" && (!hash || hash === "about-notebook");
      const panel = panels.find(panel => panel.id === (legacyToolkit ? initialSection : hash));
      if (panel) scrollToPortfolioSection(panel, true);
      schedule();
    };
    measure();
    restore();
    update();
    window.addEventListener("hashchange", restore);
    window.addEventListener("popstate", restore);
    return () => {
      cancelAnimationFrame(frame); resize.disconnect(); scroller.removeEventListener("scroll", schedule);
      window.removeEventListener("hashchange", restore); window.removeEventListener("popstate", restore);
    };
  }, [sectionKey, initialSection]);

  useEffect(() => {
    const nav = navigation.current;
    const link = nav?.querySelector<HTMLElement>('[aria-current="location"]');
    if (nav && link) nav.scrollTo({ left: link.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2, behavior: "instant" });
  }, [active]);

  function jump(event: MouseEvent<HTMLAnchorElement>, target: string) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const panel = document.getElementById(target);
    if (!panel) return;
    event.preventDefault(); event.stopPropagation();
    if (!container.current?.closest("[data-section-scroll-root]") && window.location.hash !== `#${target}`) {
      window.history.pushState(null, "", `#${target}`);
    }
    panel.focus({ preventScroll: true });
    scrollToPortfolioSection(panel);
  }

  return <div ref={container} id={id} className={`reading-sections ${className}`}>
    <nav ref={navigation} className="chapter-tabs" aria-label={label}>
      {sections.map(section => <a key={section.id} id={`${section.id}-link`} href={`#${section.id}`} aria-current={active === section.id ? "location" : undefined} onClick={event => jump(event, section.id)}>
        {section.label}
      </a>)}
    </nav>
    {sections.map(section => <section key={section.id} id={section.id} data-scroll-section className="reading-section notebook-panel" tabIndex={-1} aria-labelledby={`${section.id}-link`}>{section.content}</section>)}
  </div>;
}
