"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { localAnchorId, registerPageScroller, scrollToPortfolioSection } from "@/lib/portfolio-scroll";

const introSelector = [
  '.immersive-hero-copy > .eyebrow', '.kinetic-heading > span', '.hero-changing',
  '.immersive-description', '.hero-actions', '.hero-social-links',
  '.showcase-heading h1', '.showcase-heading p', '.page-heading > *',
  '.personal-hero-copy > *', '.case-hero-copy > *',
].join(',');

const revealSelector = [
  '.experience-grid > article', '.story-chapter', '.collaboration-card',
  '.feature-grid > article', '.decision-grid > article', '.case-hero-visual',
  '.research-crosslink', '.cp-home-feature > div', '.cp-home-feature > a',
  '.activity-highlights-copy', '.activity-highlight-metrics > div',
  '.work-together-heading', '.work-together-panel', '.project-filter-row',
  '.reading-section > h2', '.reading-section > h3', '[data-motion-reveal]',
].join(',');

/** GSAP and Lenis share a ticker. HTML remains visible if enhancement cannot load. */
export function PortfolioMotion() {
  const progress = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const shell = progress.current?.closest<HTMLElement>('.portfolio-shell');
    if (!shell) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false;
    let generation = 0;
    let cleanup = () => {};

    const install = async () => {
      const current = ++generation;
      cleanup();
      cleanup = () => {};
      if (preference.matches) return;

      try {
        const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
          import('gsap'), import('gsap/ScrollTrigger'), import('lenis'),
        ]);
        if (disposed || current !== generation || preference.matches) return;
        gsap.registerPlugin(ScrollTrigger);

        const disposers: Array<() => void> = [];
        cleanup = () => {
          for (const dispose of disposers.splice(0).reverse()) dispose();
          delete shell.dataset.motionReady;
        };

        const lenis = new Lenis({
          autoRaf: false,
          lerp: 0.12,
          smoothWheel: true,
          // Touch retains the browser's momentum; ScrollTrigger uses the same native position.
          syncTouch: false,
          anchors: false,
          prevent: node => !!node.closest('[role="dialog"], [data-lenis-prevent]'),
        });
        disposers.push(() => lenis.destroy());
        const unregister = registerPageScroller(lenis);
        disposers.push(unregister);
        const tick = (seconds: number) => { if (!document.hidden) lenis.raf(seconds * 1000); };
        const updateScroll = () => ScrollTrigger.update();
        lenis.on('scroll', updateScroll);
        disposers.push(() => lenis.off('scroll', updateScroll));
        gsap.ticker.lagSmoothing(0);
        gsap.ticker.add(tick);
        disposers.push(() => gsap.ticker.remove(tick));
        shell.dataset.motionReady = 'true';

        const context = gsap.context(() => {
          const intro = Array.from(shell.querySelectorAll<HTMLElement>(introSelector));
          if (intro.length) gsap.fromTo(intro,
            { y: 24, opacity: 0.25 },
            { y: 0, opacity: 1, duration: 0.75, stagger: 0.065, ease: 'power3.out', clearProps: 'transform,opacity' },
          );

          shell.querySelectorAll<HTMLElement>(revealSelector).forEach(element => {
            // Animate on entry, rather than hiding offscreen content before JavaScript runs.
            const reveal = gsap.fromTo(element, { y: 28, opacity: 0.35 }, {
              y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
              paused: true, immediateRender: false, clearProps: 'transform,opacity',
            });
            ScrollTrigger.create({ trigger: element, start: 'top 92%', once: true, onEnter: () => { reveal.play(); } });
          });

          if (progress.current) gsap.fromTo(progress.current, { scaleX: 0 }, {
            scaleX: 1, ease: 'none',
            scrollTrigger: { start: 0, end: () => Math.max(1, ScrollTrigger.maxScroll(window)), scrub: 0.15 },
          });
        }, shell);
        disposers.push(() => context.revert());

        const syncLock = () => {
          if (document.body.hasAttribute('data-scroll-locked') || getComputedStyle(document.body).overflow === 'hidden') lenis.stop();
          else lenis.start();
        };
        const locks = new MutationObserver(syncLock);
        locks.observe(document.body, { attributes: true, attributeFilter: ['data-scroll-locked', 'style'] });
        disposers.push(() => locks.disconnect());
        syncLock();

        const anchorClick = (event: MouseEvent) => {
          if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
          if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self') || link.closest('[role="dialog"]')) return;
          const id = localAnchorId(link.href, window.location.href);
          const target = id ? document.getElementById(id) : null;
          if (!target) return;
          event.preventDefault();
          if (window.location.hash !== new URL(link.href).hash) window.history.pushState(null, '', new URL(link.href).hash);
          if (!target.hasAttribute('tabindex') && !target.matches('a[href],button,input,select,textarea')) {
            target.setAttribute('tabindex', '-1');
            target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
          }
          target.focus({ preventScroll: true });
          scrollToPortfolioSection(target);
        };
        document.addEventListener('click', anchorClick);
        disposers.push(() => document.removeEventListener('click', anchorClick));

        let resizeFrame = 0;
        disposers.push(() => cancelAnimationFrame(resizeFrame));
        const refresh = () => {
          if (resizeFrame) return;
          resizeFrame = requestAnimationFrame(() => {
            resizeFrame = 0;
            lenis.resize();
            ScrollTrigger.refresh();
          });
        };
        const size = new ResizeObserver(refresh);
        disposers.push(() => size.disconnect());
        const main = shell.querySelector('main');
        if (main) size.observe(main);
        window.addEventListener('pageshow', refresh);
        disposers.push(() => window.removeEventListener('pageshow', refresh));
        void document.fonts.ready.then(() => { if (!disposed && current === generation) refresh(); });
        refresh();

      } catch (error) {
        cleanup();
        console.warn('Portfolio motion enhancement could not load; native scrolling remains available.', error);
      }
    };

    void install();
    const change = () => { void install(); };
    preference.addEventListener('change', change);
    return () => { disposed = true; generation++; preference.removeEventListener('change', change); cleanup(); };
  }, [pathname]);

  return <div className="portfolio-reading-progress" aria-hidden="true"><span ref={progress} /></div>;
}
