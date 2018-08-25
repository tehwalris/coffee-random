import * as React from "react";
import { mix, easeOutQuad, easeInQuad } from "../util";
import { colors } from "../style";

interface Props {
  tick: boolean;
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
    const pointStr = this.getPoints()
      .map(({ x, y }) => `${x},${y}`)
      .join(" ");
    const { size } = this.props;
    return (
      <svg
        width={size}
        height={size}
        viewBox="-1 -1 2 2"
        style={{ overflow: "visible" }}
      >
        <circle r="1" fill={colors.primaryBackground} />
        <polyline
          points={pointStr}
          stroke={colors.primaryContent}
          strokeWidth="0.05"
          fill="none"
        />
      </svg>
    );
  }

  private getPoints(): Point[] {
    const { tick } = this.props;
    const a = spinnerConfig(
      Math.PI / 2 + (tick ? easeInQuad(this.props.t) : this.props.t) * Math.PI,
    );
    if (!tick) {
      return configToPoints(a);
    }
    const t = easeOutQuad(Math.min(1, this.props.t * 1.25));
    return configToPoints(mixConfig(a, TICK_CONFIG, t));
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
