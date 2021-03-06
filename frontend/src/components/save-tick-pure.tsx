import * as React from "react";
import {
  mix,
  easeOutQuad,
  easeInQuad,
  unreachable,
  ANIMATION_SLOWDOWN,
} from "../util";
import { colors, sizes } from "../style";
import { RatingState } from "../store";

// SaveTickPure is a controllable tick, cross and loading spinner component.

interface Props {
  ratingState: RatingState;
  t: number; // [0, 1]
  size: string;
}

interface Config {
  center: Point;
  short: Part;
  long: Part;
}

interface Point {
  x: number;
  y: number;
}

interface Part {
  length: number;
  angle: number;
}

const TICK_CONFIG = {
  center: { x: -0.07, y: 0.38 },
  short: { length: 0.4, angle: Math.PI / 2 - 0.72 * Math.PI },
  long: { length: 1, angle: 0.32 * Math.PI },
};

export default class SaveTick extends React.Component<Props> {
  render() {
    const pointStrs = this.getPoints().map(g =>
      g.map(({ x, y }) => `${x},${y}`).join(" "),
    );
    const { size, ratingState } = this.props;
    return (
      <svg
        width={size}
        height={size}
        viewBox="-1 -1 2 2"
        style={{ overflow: "visible" }}
      >
        <defs>
          <filter id="shadow">
            <feOffset
              in="SourceAlpha"
              dx={(2 * sizes.shadow.offsetXPx) / sizes.tickSizePx}
              dy={(2 * sizes.shadow.offsetYPx) / sizes.tickSizePx}
              opacity={sizes.shadow.opacity}
            />
            <feComponentTransfer>
              <feFuncA type="linear" slope={sizes.shadow.opacity} />
            </feComponentTransfer>
            <feGaussianBlur stdDeviation="0.05" />
            <feBlend in="SourceGraphic" mode="normal" />
          </filter>
        </defs>
        <circle
          r="1"
          fill={
            ratingState === RatingState.Error
              ? colors.errorDark
              : colors.primaryBackground
          }
          style={{ transition: `fill ${0.5 * ANIMATION_SLOWDOWN}s ease` }}
          filter="url(#shadow)"
        />
        {pointStrs.map((s, i) => (
          <polyline
            key={i}
            points={s}
            stroke={colors.primaryContent}
            strokeWidth="0.05"
            fill="none"
          />
        ))}
      </svg>
    );
  }

  private getPoints(): Point[][] {
    const { ratingState } = this.props;
    const a = spinnerConfig(
      Math.PI / 2 +
        (ratingState === RatingState.Saving
          ? this.props.t
          : easeInQuad(this.props.t)) *
          Math.PI,
    );
    switch (ratingState) {
      case RatingState.Saving: {
        return [configToPoints(a)];
      }
      case RatingState.Ok: {
        const t = easeOutQuad(Math.min(1, this.props.t * 1.25));
        return [configToPoints(mixConfig(a, TICK_CONFIG, t))];
      }
      case RatingState.Error: {
        const t = easeOutQuad(Math.min(1, this.props.t * 1.25));
        return [
          configToPoints(spinnerConfig(Math.PI * (0.5 + t * 0.25))),
          configToPoints(spinnerConfig(Math.PI * (0.5 + t * 0.75))),
        ];
      }
      default:
        return unreachable(ratingState);
    }
  }
}

function configToPoints({ center, short, long }: Config): Point[] {
  return [
    {
      x: center.x - Math.cos(short.angle) * short.length,
      y: center.y + Math.sin(short.angle) * short.length,
    },
    center,
    {
      x: center.x + Math.cos(long.angle) * long.length,
      y: center.y - Math.sin(long.angle) * long.length,
    },
  ];
}

function spinnerConfig(alpha: number): Config {
  const l = 0.65;
  const a = { x: l * Math.cos(alpha), y: l * Math.sin(alpha) };
  const b = {
    x: l * Math.cos(alpha + Math.PI),
    y: l * Math.sin(alpha + Math.PI),
  };
  const m = 0.35;
  const center = { x: mix(a.x, b.x, m), y: mix(a.y, b.y, m) };
  return {
    center,
    short: { length: dist(center, a), angle: Math.PI - alpha },
    long: { length: dist(center, b), angle: Math.PI - alpha },
  };
}

function dist(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function mixConfig(a: Config, b: Config, t: number): Config {
  return {
    center: {
      x: mix(a.center.x, b.center.x, t),
      y: mix(a.center.y, b.center.y, t),
    },
    short: {
      length: mix(a.short.length, b.short.length, t),
      angle: mix(a.short.angle, b.short.angle, t),
    },
    long: {
      length: mix(a.long.length, b.long.length, t),
      angle: mix(a.long.angle, b.long.angle, t),
    },
  };
}
