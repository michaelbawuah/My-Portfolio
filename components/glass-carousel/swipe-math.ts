/** Resolve a release from distance and recent velocity, in pixels per millisecond. */
export function swipeSteps(distance: number, velocity: number, spacing: number) {
  if (!Number.isFinite(spacing) || spacing <= 0) return 0;
  let steps = Math.round(-distance / spacing);
  if (steps === 0 && (Math.abs(distance) >= 40 || Math.abs(velocity) > 0.35)) {
    steps = (Math.abs(distance) >= 6 ? distance : velocity) < 0 ? 1 : -1;
  } else if (Math.abs(velocity) > 0.9) {
    steps += velocity < 0 ? 1 : -1;
  }
  return Math.max(-2, Math.min(2, steps)) || 0;
}

export function circularDistance(index: number, active: number, count: number) {
  if (count < 2) return 0;
  return (((index - active + count / 2) % count) + count) % count - count / 2;
}

/** A continuous trackpad gesture, including its momentum tail, advances once. */
export function createWheelGesture() {
  let accumulated = 0;
  let last = -Infinity;
  let lockedUntil = -Infinity;
  return (dx: number, dy: number, now: number) => {
    if (Math.abs(dx) <= Math.abs(dy)) return 0;
    if (now < lockedUntil) { lockedUntil = now + 420; last = now; return 0; }
    if (now - last > 180 || Math.sign(accumulated) !== Math.sign(dx)) accumulated = 0;
    last = now;
    accumulated += dx;
    if (Math.abs(accumulated) < 50) return 0;
    const step = accumulated > 0 ? 1 : -1;
    accumulated = 0;
    lockedUntil = now + 420;
    return step;
  };
}
