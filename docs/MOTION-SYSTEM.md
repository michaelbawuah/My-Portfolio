# Portfolio motion

The portfolio uses its existing GSAP 3.15.0 and Lenis 1.3.15 dependencies. React Bits components are included as customized source, so there is no second animation framework or registry runtime to download.

## What runs where

- `components/portfolio-motion.tsx` loads GSAP, ScrollTrigger, and Lenis together after hydration. A single GSAP ticker drives Lenis, and Lenis scroll events update ScrollTrigger. Native touch momentum remains enabled; the same entrance and section animations run at every viewport size.
- Headings enter in sequence. Story, research, project-detail, and contact content reveal as it enters the viewport. A thin reading-progress line follows the page. These effects use transforms and opacity, not large animated blurs or layout measurements on every scroll event.
- `lib/portfolio-scroll.ts` connects chapter links to Lenis using the existing sticky-header offsets. Dialog chapter links scroll their own container. Cross-page links, external links, modified clicks, and download links retain browser behavior.
- `components/react-bits/SpotlightCard.tsx` adds pointer, touch, and keyboard-focus light to the project cards and contact panel. Ambient motion and proximity tracking are disabled at the call sites. Existing card tilt and Motion-powered filtering remain intact.
- `components/react-bits/Magnet.tsx` adds a small, bounded pull to the home-page buttons with a mouse, and press feedback on touch. Keyboard focus keeps the target still. Pointer positions update CSS variables once per frame without re-rendering React.

Page changes and live reduced-motion changes remove their ticker callback, observers, listeners, scroll registration, and GSAP context. Opening a dialog stops page smoothing. Closing it resumes smoothing. The static HTML remains readable when JavaScript is disabled or motion modules fail to load.

## Sources and notices

- [GSAP](https://github.com/greensock/GSAP), including [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).
- [Lenis by darkroom.engineering](https://github.com/darkroomengineering/lenis); integration follows its documented GSAP ticker setup. Pinned-version types are used rather than newer README-only options.
- [React Bits SpotlightCard](https://github.com/DavidHDev/react-bits/tree/main/src/ts-default/Components/SpotlightCard), source blob `1a2b2fdb2a8627fa3551af987a6a9b4600ab27d1`, stylesheet blob `a4c9b873b8d474aa671b74cde70384bc7ce93070`.
- [React Bits Magnet](https://github.com/DavidHDev/react-bits/tree/main/src/ts-default/Animations/Magnet), source blob `3b2575e8d4ae4114a8e503eb0828b2871719303f`.

React Bits copyright and its MIT + Commons Clause notice are preserved in `components/react-bits/LICENSE.md`. SpotlightCard is adapted to the portfolio theme tokens, live reduced-motion preferences, and hidden-tab cleanup. Magnet is adapted to bounded movement, coalesced pointer updates, and keyboard/touch behavior. These components are distributed as part of this portfolio application.

## Project-led visual pass

Home now uses a large clipped-word introduction, an angled portrait composition, and a dedicated window for the existing keyboard scene. The window is framed whenever it is visible, including on phones. GSAP sequences the words, underline, portrait, and project notes; scrolling moves the portrait image slightly.

`components/build-showcase.tsx` supplies a compact, keyboard-accessible tabbed showcase on Home and three continuously scrollable chapters on Work. Chapter links remain native anchors enhanced by the existing scroll controller. Large project previews straighten and expand into place with scroll on both desktop and touch. An observer starts the short illustration sequences when the previews themselves enter the viewport. Work retains its full filterable gallery, enlarged to two columns on desktop and one on narrow phones.

The previews are explicit illustrations, not connected applications: a replayable authored NavoX conversation links to the recorded video; a linear computation illustrates forward values and independently checked gradients; a Fenwick prefix-sum trace allows every array endpoint and each query step. The project image toggle links to the original retained assets. Math lives in `lib/build-examples.ts`; tests compare every trace to a direct sum and gradients to finite differences.

No new dependencies, providers, accounts, or external API calls are required. Short illustrative sequences finish automatically. Reduced motion leaves controls and static content available. The phone graph uses a readable HTML layout instead of shrinking SVG text, and the narrowest array layout gives buttons two rows.

Validation for this pass: the 11 scroll/example tests, TypeScript, and production build. Browser visual verification remains unavailable in this environment because the required control-browser skill is not installed.

## Commands

Run `node --experimental-strip-types --test tests/portfolio-scroll.test.mjs tests/build-examples.test.mjs`, followed by the TypeScript check and the existing production build. The scroll tests cover sticky offsets, nested previews, reduced motion, deep-link restoration, fallback scrolling, safe URL handling, and page-transition cleanup.

Visual follow-up: home introduction and buttons; Work filters, cards, and preview scrolling; project chapter links and browser back; About deep links; both themes; phone touch scrolling; reduced motion toggled while the page is open. Keep the default night theme, existing keyboard/cat scene, and Work-heading contrast treatment.
