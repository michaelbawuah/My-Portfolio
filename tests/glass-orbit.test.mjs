import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createOrbitMotion, orbitPresence } from '../components/glass-carousel/orbit-motion.ts';

function run(motion, ms, running = true, fps = 60) {
  for (let elapsed = 0; elapsed < ms; elapsed += 1000 / fps) motion.advance(1000 / fps, running);
  return motion.snapshot();
}

test('the tour moves continuously and cycles every project without resetting at the end', () => {
  const motion = createOrbitMotion(9);
  const seen = new Set();
  let previous = 0;
  for (let tick = 0; tick < 4200; tick++) {
    const frame = motion.advance(1000 / 60, true);
    assert.ok(frame.position > previous);
    assert.ok(frame.position - previous < .01);
    assert.ok(frame.index >= 0 && frame.index < 9);
    previous = frame.position; seen.add(frame.index);
  }
  assert.equal(seen.size, 9);
  assert.ok(previous > 9);
});

test('rotation has the same pace on 30, 60 and 120Hz displays', () => {
  const positions = [30, 60, 120].map(fps => run(createOrbitMotion(9), 10000, true, fps).position);
  assert.ok(Math.max(...positions) - Math.min(...positions) < .03);
});

test('pausing centers the nearest card and resumes from that position without a jump', () => {
  const motion = createOrbitMotion(9);
  const before = run(motion, 4500).position;
  const stopped = run(motion, 2000, false);
  assert.equal(stopped.position, Math.round(before));
  assert.equal(motion.needsFrame(false, false), false);
  assert.equal(run(motion, 3000, false).position, stopped.position);
  const resumed = motion.advance(16, true).position;
  assert.ok(resumed >= stopped.position && resumed - stopped.position < .001);
});

test('a drag starts at the moving position and releases one or two cards from its origin', () => {
  const motion = createOrbitMotion(9);
  const start = run(motion, 2400).position;
  motion.grab(); motion.drag(.4);
  assert.equal(motion.snapshot().position, start + .4);
  assert.equal(motion.advance(1000, true).position, start + .4);
  motion.release(2);
  assert.equal(run(motion, 1500, false).position, Math.round(start) + 2);
});

test('vertical scroll cancellation does not trap motion, and manual navigation gets reading time', () => {
  const motion = createOrbitMotion(9);
  motion.grab(); motion.release(0, true);
  run(motion, 500, true);
  assert.equal(motion.snapshot().position, 0);
  assert.ok(run(motion, 3000, true).position > 0);
  motion.step(1);
  const settled = run(motion, 1400, true).position;
  assert.equal(settled, 1);
  assert.equal(run(motion, 500, true).position, 1);
});

test('dot selection takes the short circular route and repeated arrow clicks are preserved', () => {
  const motion = createOrbitMotion(9);
  motion.select(8);
  assert.equal(run(motion, 1500, false).position, -1);
  assert.equal(motion.snapshot().index, 8);
  motion.step(1); motion.step(1);
  assert.equal(run(motion, 1500, false).position, 1);
});

test('reduced motion stays still and manual controls move immediately', () => {
  const motion = createOrbitMotion(9);
  assert.equal(motion.advance(5000, true, true).position, 0);
  motion.select(3);
  assert.equal(motion.advance(16, false, true).position, 3);
  assert.equal(motion.needsFrame(true, true), false);
});

test('resuming a hidden or stalled page never catches up a whole carousel revolution', () => {
  const motion = createOrbitMotion(9);
  const before = run(motion, 7000).position;
  const after = motion.advance(600000, true).position;
  assert.ok(after - before < .02);
});

test('rear cards fade before wrap even in two- and three-project decks', () => {
  for (const count of [2, 3, 9]) {
    assert.equal(orbitPresence(0, count), 1);
    assert.equal(orbitPresence(count / 2, count), 0);
    assert.equal(orbitPresence(-count / 2, count), 0);
    assert.ok(orbitPresence(Math.min(2.65, count / 2) - .1, count) < .5);
  }
  assert.equal(orbitPresence(0, 1), 1);
  for (const count of [0, 1]) {
    const motion = createOrbitMotion(count);
    motion.step(1); motion.select(8);
    assert.equal(motion.advance(10000, true).position, 0);
    assert.equal(motion.needsFrame(true, false), false);
  }
});
