/** Small, deterministic examples used by the portfolio's interactive diagrams. */
export const exampleValues = [2, 1, 3, 4, 2, 5, 1, 6] as const;

export function prefixTrace(values: readonly number[], count: number) {
  if (!Number.isInteger(count) || count < 1 || count > values.length) {
    throw new RangeError('Choose a prefix within the array.');
  }
  const steps: Array<{ index: number; start: number; value: number }> = [];
  for (let index = count; index > 0; index -= index & -index) {
    const start = index - (index & -index);
    steps.push({ index, start: start + 1, value: values.slice(start, index).reduce((sum, value) => sum + value, 0) });
  }
  return { steps, total: steps.reduce((sum, step) => sum + step.value, 0) };
}

export function linearExample(x: number, weight: number, bias: number) {
  return { output: x * weight + bias, dx: weight, dw: x, db: 1 };
}
