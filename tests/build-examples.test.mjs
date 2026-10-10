import assert from 'node:assert/strict';
import { test } from 'node:test';
import { exampleValues, prefixTrace, linearExample } from '../lib/build-examples.ts';

test('every displayed prefix matches a direct sum and its ranges cover each value exactly once', () => {
  const arrays = [exampleValues, [-5, 2, 0, 4, -3, 6, 8, 1], Array.from({ length: 31 }, (_, i) => (i * 7) % 11 - 5)];
  for (const values of arrays) for (let count = 1; count <= values.length; count++) {
    const { steps, total } = prefixTrace(values, count);
    assert.equal(total, values.slice(0, count).reduce((sum, value) => sum + value, 0));
    const covered = steps.flatMap(step => Array.from({ length: step.index - step.start + 1 }, (_, i) => step.start + i));
    assert.deepEqual(covered.sort((a, b) => a - b), Array.from({ length: count }, (_, i) => i + 1));
    assert.ok(steps.every((step, i) => i === 0 || step.index < steps[i - 1].index));
  }
});

test('the initial C++ illustration walks 7 → 6 → 4 → 0 and reaches 18', () => {
  assert.deepEqual(prefixTrace(exampleValues, 7), {
    steps: [{ index: 7, start: 7, value: 1 }, { index: 6, start: 5, value: 7 }, { index: 4, start: 1, value: 10 }],
    total: 18,
  });
});

test('invalid prefixes fail without starting a query', () => {
  for (const count of [0, -1, 1.5, 9, NaN, Infinity]) assert.throws(() => prefixTrace(exampleValues, count), RangeError);
  assert.throws(() => prefixTrace([], 1), RangeError);
});

test('Fluxion example gradients agree with independent finite differences', () => {
  const f = ([x, w, b]) => x * w + b;
  for (const point of [[2, 3, 1], [4, 3, 1], [-2, 0.5, -1], [0, -4, 5]]) {
    const result = linearExample(...point);
    assert.equal(result.output, f(point));
    for (const [axis, gradient] of [result.dx, result.dw, result.db].entries()) {
      const plus = [...point], minus = [...point], epsilon = 1e-5;
      plus[axis] += epsilon; minus[axis] -= epsilon;
      assert.ok(Math.abs((f(plus) - f(minus)) / (2 * epsilon) - gradient) < 1e-8);
    }
  }
});
