/** A time-based orbit with a spring handover to direct navigation. No DOM or timers. */
export function createOrbitMotion(count: number, duration = 6000) {
  let position = 0;
  let velocity = 0;
  let target: number | null = null;
  let origin = 0;
  let grabbed = false;
  let hold = 0;
  let notify = () => {};
  const wrap = (value: number, size = count) => size > 0 ? ((value % size) + size) % size : 0;
  const snapshot = () => ({ position, index: wrap(Math.round(position)), progress: wrap(position + .5, 1) });
  const go = (value: number) => { target = value; grabbed = false; hold = 2200; notify(); };

  return {
    snapshot,
    subscribe(listener: () => void) { notify = listener; return () => { notify = () => {}; }; },
    select(index: number) {
      if (count < 2) return;
      const distance = wrap(index - position + count / 2) - count / 2;
      go(position + distance);
    },
    step(direction: number) { if (count > 1) go(Math.round(target ?? position) + direction); },
    grab() { origin = position; velocity = 0; target = null; grabbed = true; notify(); },
    drag(offset: number) { if (grabbed) { position = origin + offset; notify(); } },
    release(steps: number, cancelled = false) { if (grabbed) go(Math.round(origin) + (cancelled ? 0 : steps)); },
    needsFrame(running: boolean, reduced: boolean) { return !grabbed && count > 1 && (target !== null || (running && !reduced)); },
    advance(elapsed: number, running: boolean, reduced = false) {
      // Hidden tabs and slow frames must never fast-forward through several projects.
      const ms = Math.min(48, Math.max(0, elapsed));
      const dt = ms / 1000;
      if (count < 2) { position = 0; velocity = 0; target = null; return snapshot(); }
      if (grabbed) return snapshot();
      if (reduced) {
        position = Math.round(target ?? position); velocity = 0; target = null;
        return snapshot();
      }
      if (!running && target === null) target = Math.round(position);
      if (target !== null) {
        // Analytic critically damped spring: continuous position and velocity, no overshoot wobble.
        const error = position - target;
        const decay = Math.exp(-18 * dt);
        const change = (velocity + 18 * error) * dt;
        position = target + (error + change) * decay;
        velocity = (velocity - 18 * change) * decay;
        if (Math.abs(position - target) < .0005 && Math.abs(velocity) < .002) {
          position = target; velocity = 0; target = null;
        }
      } else if (hold > 0) {
        hold = Math.max(0, hold - ms);
      } else if (running) {
        // Spend more time around the readable center, accelerate gently between projects.
        const speed = (1000 / Math.max(3000, duration)) * (1.25 - .7 * Math.cos(position * Math.PI * 2));
        velocity += (speed - velocity) * (1 - Math.exp(-ms / 360));
        position += velocity * dt;
      }
      return snapshot();
    },
  };
}

/** Fade the back of short decks before wrapping, so a recycled card cannot cross the foreground. */
export function orbitPresence(distance: number, count: number) {
  if (count < 2) return 1;
  const edge = Math.min(2.65, count / 2);
  const fade = Math.min(.45, edge / 3);
  return Math.max(0, Math.min(1, (edge - Math.abs(distance)) / fade));
}

export type OrbitMotion = ReturnType<typeof createOrbitMotion>;
