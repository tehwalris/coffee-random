export function mix(a: number, b: number, t: number): number {
  return a * (1 - t) + b * t;
}

export function unreachable(x: never): never {
  throw new Error("unreachable");
}

// Easing functions from https://gist.github.com/gre/1650294

export function easeInQuad(t: number) {
  return t * t;
}

export function easeOutQuad(t: number) {
  return t * (2 - t);
}

// ANIMATION_SLOWDOWN slows down all animations in the app (for demo purposes).
// A value of 10 means everything will happen 10 times slower.
// Values less than 1 are also allowed.
export const ANIMATION_SLOWDOWN = 1;
