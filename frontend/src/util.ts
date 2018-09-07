import * as ReactSpring from "react-spring";

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

export const RENDER_DEBUG = false;
export const ANIMATION_SLOWDOWN = 1;

// tslint:disable-next-line:no-any
export const SpringTransition = (ReactSpring as any).Transition;
