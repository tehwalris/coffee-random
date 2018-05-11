export function mix(a: number, b: number, t: number): number {
  return a * (1 - t) + b * t;
}

export function easeOutQuad(t: number) {
  return t * (2 - t);
}
