import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { localAnchorId, registerPageScroller, scrollToPortfolioSection } from '../lib/portfolio-scroll.ts';

const current = 'https://michaelbaffourawuah.com/projects/fluxion';

test('only same-page anchors are handled by smooth scrolling', () => {
  assert.equal(localAnchorId('#evidence', current), 'evidence');
  assert.equal(localAnchorId('/projects/fluxion#code', current), 'code');
  assert.equal(localAnchorId('#how%20it%20works', current), 'how it works');
  assert.equal(localAnchorId('/about#toolkit', current), null);
  assert.equal(localAnchorId('https://github.com/michaelbawuah#code', current), null);
  assert.equal(localAnchorId('?view=other#code', current), null);
  assert.equal(localAnchorId('mailto:hello@example.com', current), null);
  assert.equal(localAnchorId('#%zz', current), null);
  assert.equal(localAnchorId('#', current), null);
});

const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
const originalDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
const originalStyle = Object.getOwnPropertyDescriptor(globalThis, 'getComputedStyle');
let unregister = () => {};
afterEach(() => {
  unregister();
  for (const [key, value] of [['window', originalWindow], ['document', originalDocument], ['getComputedStyle', originalStyle]]) {
    if (value) Object.defineProperty(globalThis, key, value);
    else Reflect.deleteProperty(globalThis, key);
  }
});

function fixture({ nested = false, reduced = false } = {}) {
  const nativeCalls = [];
  const smoothCalls = [];
  const root = {};
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { matchMedia: () => ({ matches: reduced }) } });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: { documentElement: root } });
  Object.defineProperty(globalThis, 'getComputedStyle', { configurable: true, value: (element) => element === root ? { scrollPaddingTop: '12px' } : { scrollMarginTop: '104px' } });
  const target = {
    closest: () => nested ? {} : null,
    scrollIntoView: (options) => nativeCalls.push(options),
  };
  unregister = registerPageScroller({ scrollTo: (_element, options) => { smoothCalls.push(options); } });
  return { target, nativeCalls, smoothCalls };
}

test('chapter links account for the sticky header and chapter bar', () => {
  const { target, nativeCalls, smoothCalls } = fixture();
  scrollToPortfolioSection(target);
  assert.deepEqual(smoothCalls, [{ offset: -116, immediate: false }]);
  assert.equal(nativeCalls.length, 0);
});

test('a chapter inside a dialog scrolls the nested container, never the page', () => {
  const { target, nativeCalls, smoothCalls } = fixture({ nested: true });
  scrollToPortfolioSection(target);
  assert.deepEqual(nativeCalls, [{ block: 'start', behavior: 'smooth' }]);
  assert.equal(smoothCalls.length, 0);
});

test('reduced motion is honored even when Lenis is still registered', () => {
  const { target, nativeCalls, smoothCalls } = fixture({ reduced: true });
  scrollToPortfolioSection(target);
  assert.deepEqual(nativeCalls, [{ block: 'start', behavior: 'instant' }]);
  assert.equal(smoothCalls.length, 0);
});

test('deep-link restoration is immediate and preserves its offset', () => {
  const { target, smoothCalls } = fixture();
  scrollToPortfolioSection(target, true);
  assert.deepEqual(smoothCalls, [{ offset: -116, immediate: true }]);
});

test('chapter navigation stays functional after the enhancement is destroyed', () => {
  const { target, nativeCalls, smoothCalls } = fixture();
  unregister();
  scrollToPortfolioSection(target);
  assert.deepEqual(nativeCalls, [{ block: 'start', behavior: 'smooth' }]);
  assert.equal(smoothCalls.length, 0);
});

test('cleanup from an old page cannot unregister the new page scroller', () => {
  const { target, smoothCalls } = fixture();
  const oldCleanup = unregister;
  let newCalls = 0;
  unregister = registerPageScroller({ scrollTo: () => { newCalls++; } });
  oldCleanup();
  scrollToPortfolioSection(target);
  assert.equal(newCalls, 1);
  assert.equal(smoothCalls.length, 0);
});
