import assert from 'node:assert/strict';
import { test } from 'node:test';
import { circularDistance, createWheelGesture, swipeSteps } from '../components/glass-carousel/swipe-math.ts';

test('a 50px flick advances exactly one card at desktop, tablet and phone spacing', () => {
  for (const spacing of [520, 380, 250]) {
    for (const velocity of [0, .5, 1.8]) {
      assert.equal(swipeSteps(-50, -velocity, spacing), 1);
      assert.equal(swipeSteps(50, velocity, spacing), -1);
    }
  }
});
test('a short slow drag settles back, while a quick flick advances', () => {
  assert.equal(swipeSteps(-18, -.1, 520), 0);
  assert.equal(swipeSteps(-18, -.6, 520), 1);
  assert.equal(swipeSteps(18, .6, 520), -1);
  assert.equal(swipeSteps(0, 0, 0), 0);
});
test('a long fast release carries momentum but remains bounded', () => {
  assert.equal(swipeSteps(-520, -1.2, 520), 2);
  assert.equal(swipeSteps(520, 1.2, 520), -2);
  assert.equal(swipeSteps(-10000, -3, 250), 3);
});
test('circular positions put the last card beside the first and handle empty or single collections', () => {
  assert.equal(circularDistance(8, 0, 9), -1);
  assert.equal(circularDistance(0, 8, 9), 1);
  assert.equal(circularDistance(1, .5, 9), .5);
  assert.equal(circularDistance(0, 0, 1), 0);
  assert.equal(circularDistance(0, 0, 0), 0);
});
test('one trackpad gesture and its momentum tail advance only once', () => {
  const wheel = createWheelGesture();
  assert.equal(wheel(25, 0, 0), 0);
  assert.equal(wheel(30, 0, 20), 1);
  for (let time = 40; time < 1200; time += 20) assert.equal(wheel(60, 0, time), 0);
  assert.equal(wheel(60, 0, 1700), 1);
});
test('vertical wheel movement does not accumulate into a sideways navigation', () => {
  const wheel = createWheelGesture();
  assert.equal(wheel(100, 200, 0), 0);
  assert.equal(wheel(26, 0, 10), 0);
  assert.equal(wheel(-26, 0, 20), 0);
  assert.equal(wheel(-26, 0, 40), -1);
});
