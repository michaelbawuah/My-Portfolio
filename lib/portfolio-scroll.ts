/** Share one page scroller with chapter links; nested dialogs keep native scrolling. */
type PageScroller = {
  scrollTo: (target: HTMLElement, options: { offset: number; immediate: boolean }) => void;
};

let pageScroller: PageScroller | null = null;

export function registerPageScroller(scroller: PageScroller) {
  pageScroller = scroller;
  return () => { if (pageScroller === scroller) pageScroller = null; };
}

export function localAnchorId(href: string, currentHref: string): string | null {
  try {
    const current = new URL(currentHref);
    const next = new URL(href, current);
    if (next.origin !== current.origin || next.pathname !== current.pathname || next.search !== current.search || !next.hash) return null;
    return decodeURIComponent(next.hash.slice(1)) || null;
  } catch {
    return null;
  }
}

export function scrollToPortfolioSection(target: HTMLElement, immediate = false) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nested = target.closest('[data-section-scroll-root], [role="dialog"], [data-lenis-prevent]');
  if (!pageScroller || nested || reduce) {
    target.scrollIntoView({ block: 'start', behavior: immediate || reduce ? 'instant' : 'smooth' });
    return;
  }
  const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  pageScroller.scrollTo(target, { offset: -(margin + padding), immediate });
}
