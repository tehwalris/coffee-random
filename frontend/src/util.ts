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