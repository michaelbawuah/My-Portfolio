import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createPourEngine } from '../components/glass-carousel/pour-engine.ts';

function harness(t, reduced = false) {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const previous = { window: globalThis.window, requestAnimationFrame: globalThis.requestAnimationFrame, cancelAnimationFrame: globalThis.cancelAnimationFrame };
  const frames = new Map(); let nextFrame = 0;
  globalThis.window = { matchMedia: () => ({ matches: reduced }) };
  globalThis.requestAnimationFrame = fn => { frames.set(++nextFrame, fn); return nextFrame; };
  globalThis.cancelAnimationFrame = id => frames.delete(id);
  function element(x = 0, y = 0, width = 64, height = 64) {
    const classes = new Set(), animations = [];
    return {
      dataset: {}, animations, style: { visibility: '', setProperty(name, value) { this[name] = value; } },
      classList: { add: (...v) => v.forEach(x => classes.add(x)), remove: (...v) => v.forEach(x => classes.delete(x)), contains: x => classes.has(x) },
      getBoundingClientRect: () => ({ left: x, top: y, width, height }),
      matches: () => true,
      animate(keyframes, options) {
        const a = { keyframes, options, onfinish: null, cancelled: false, cancel() { this.cancelled = true; }, finish() { this.onfinish?.(); } };
        animations.push(a); return a;
      },
    };
  }
  const root = element(), source = element(330, 40), cta = element(180, 460, 340, 48), traveler = element();
  const blobs = Array.from({ length: 5 }, (_, k) => element(150 + k * 72, 500));
  const drop = element(), splash = Array.from({ length: 3 }, () => element());
  cta.querySelectorAll = name => name === '.pour__blob' ? blobs : splash;
  cta.querySelector = () => drop;
  const sourceRef = { current: source }, ctaRef = { current: cta }, changes = [];
  const engine = createPourEngine({ rootRef: { current: root }, sourceRef, ctaRef, onChange: (...v) => changes.push(v) });
  engine.travRef.current = traveler;
  const flushFrame = () => { const entries = [...frames.values()]; frames.clear(); entries.forEach(fn => fn()); };
  const fly = () => { flushFrame(); flushFrame(); };
  const finishFlight = () => traveler.animations.at(-1).finish();
  const enter = () => engine.handlers.onPointerEnter({ pointerType: 'mouse' });
  const leave = () => engine.handlers.onPointerLeave({ pointerType: 'mouse' });
  t.after(() => { engine.dispose(); Object.assign(globalThis, previous); });
  return { engine, source, sourceRef, cta, traveler, changes, element, fly, finishFlight, enter, leave, frames };
}

test('rapid hover-out finishes the flight, drains, and restores the original orb', t => {
  const h = harness(t); h.enter(); h.fly();
  assert.equal(h.source.style.visibility, 'hidden');
  h.leave(); h.finishFlight();
  assert.equal(h.cta.classList.contains('is-filled'), true);
  t.mock.timers.tick(840); assert.equal(h.cta.dataset.pourState, 'rising');
  t.mock.timers.tick(260); h.finishFlight();
  assert.equal(h.source.style.visibility, '');
  assert.equal(h.cta.dataset.pourState, 'parked');
  assert.equal(h.cta.classList.contains('is-filled'), false);
});

test('project changes restore the departing source even after React replaces refs', t => {
  const h = harness(t); h.enter(); h.fly();
  const replacement = h.element(); h.sourceRef.current = replacement;
  h.engine.reset(); t.mock.timers.tick(10000);
  assert.equal(h.source.style.visibility, '');
  assert.equal(replacement.style.visibility, '');
  assert.equal(h.traveler.animations.every(a => a.cancelled), true);
  assert.equal(h.cta.dataset.pourState, 'parked');
});

test('reset cancels queued frames before a newly selected orb can be hidden', t => {
  const h = harness(t); h.enter(); h.engine.reset(); h.fly();
  assert.equal(h.frames.size, 0);
  assert.equal(h.source.style.visibility, '');
  assert.equal(h.traveler.animations.length, 0);
});

test('touch previews once, permits the second tap, and automatically drains with reduced motion', t => {
  const h = harness(t, true); let blocked = 0;
  const click = { detail: 1, preventDefault: () => blocked++ };
  h.engine.handlers.onPointerDown({ pointerType: 'touch' }); h.engine.handlers.onClick(click);
  assert.equal(blocked, 1); assert.equal(h.cta.dataset.pourState, 'filled');
  assert.equal(h.traveler.animations.length, 0); assert.equal(h.source.style.visibility, '');
  h.engine.handlers.onPointerDown({ pointerType: 'touch' }); h.engine.handlers.onClick(click);
  assert.equal(blocked, 1);
  t.mock.timers.tick(2900);
  assert.equal(h.cta.classList.contains('is-filled'), false);
  assert.equal(h.cta.dataset.pourState, 'parked');
});

test('keyboard activation stays native after a canceled touch and focus survives mouse leave', t => {
  const h = harness(t, true);
  h.engine.handlers.onPointerDown({ pointerType: 'touch' });
  h.engine.handlers.onClick({ detail: 0, preventDefault: () => assert.fail('keyboard link was blocked') });
  h.engine.handlers.onFocus({ currentTarget: h.cta }); h.leave();
  assert.equal(h.cta.dataset.pourState, 'filled');
  h.engine.handlers.onBlur(); assert.equal(h.cta.dataset.pourState, 'parked');
});

test('unmount cancels pending impact timers and does not notify React again', t => {
  const h = harness(t); h.enter(); h.fly(); h.finishFlight();
  h.engine.dispose(); const count = h.changes.length;
  t.mock.timers.tick(10000);
  assert.equal(h.changes.length, count); assert.equal(h.source.style.visibility, '');
});
