import * as React from "react";
import posed, { PoseGroup } from "react-pose";
import { Target } from "./cover-animate";
import { css } from "glamor";
import { RatingStore, COLUMN_COUNT } from "../store";
import { Spring, config as springConfigs } from "react-spring";
import Title from "./title";
import { RENDER_DEBUG, mix, easeInQuad } from "../util";
import PlacementParent from "./placement-parent";
import Machine from "./machine";
import { HEAD_RATIO } from "./head";
import { sum, tail, zipWith } from "lodash";
import RatingSquare from "./rating-square";
import Placed from "./placed";
import { colors } from "../style";

interface Props {
  top: React.ReactChild;
  bottom: React.ReactChild;
  target: Target;
  column?: number;
  storeIndex: number;
  ratingStore?: RatingStore;
  widthPx: number;
  heightPx: number;
}

interface State {
  t: number; // [0, 1] - target postion of spring
}

const Section = posed.div({
  enter: { opacity: 1, top: 0 },
  exit: { opacity: 0, top: 0 },
});

const styles = {
  top: css({
    position: "relative",
    width: "100%",
    height: "100%",
  }),
  bottom: css({
    position: "relative",
  }),
  section: css({
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
  }),
};

const s = (k: React.Key, c: React.ReactChild) => (
  <PoseGroup>
    {[
      <Section key={k} {...styles.section}>
        {c}
      </Section>,
    ]}
  </PoseGroup>
);
const springConfig = RENDER_DEBUG
  ? springConfigs.slow
  : { tension: 50, friction: 7 };

function toSpringTarget(target: Target): number {
  return +(target === Target.Square);
}

interface Inputs {
  winW: number;
  winH: number;
  t: number;
}

class Rect {
  constructor(
    public w: number,
    public h: number,
    public x: number,
    public y: number,
  ) {
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
  }

  mix(other: Rect, t: number): Rect {
    // tslint:disable-next-line:no-any
    return new (Rect as any)(
      ...["w", "h", "x", "y"].map(k => mix(this[k], other[k], t)),
    );
  }
}

export interface Derived extends Inputs {
  square: Rect;
  machine: Rect;
  current: Rect;
  heads: Rect[];
  platforms: Rect[];
  midLayer: (headI: number, move: boolean) => Rect;
  machineOpacity: number;
  squareOpacity: number;
}

const consts = {
  squarePadPx: 25,
  squareYPx: -50,
  machineRatio: 0.45,
  machinePaddingHOuter: 0.05,
  machinePaddingHInner: 0.04,
  headW: 0.17,
  headToTop: 0.1,
  platformH: 0.1,
  platformToBottom: 0.15,
};

function layoutHeads(target: Rect, reference: Rect): Rect[] {
  const op = consts.machinePaddingHOuter * reference.w;
  const ip = consts.machinePaddingHInner * reference.w;
  const flexPad = target.w / 2 - op - ip;
  const headY = target.y + consts.headToTop * reference.h;
  const headW = consts.headW * reference.w;
  const headH = headW * HEAD_RATIO;
  let c = 0;
  return [target.x + op, flexPad, 2 * ip, flexPad].map((v, i) => {
    c += v;
    const x = i % 2 === 0 ? c : c - headW;
    return new Rect(headW, headH, x, headY);
  });
}

function layoutPlatforms(target: Rect, reference: Rect): Rect[] {
  const op = consts.machinePaddingHOuter * reference.w;
  const ip = consts.machinePaddingHInner * reference.w;
  const ph = consts.platformH * reference.h;
  const pw = reference.w / 2 - op - ip;
  const py = target.y + target.h - consts.platformToBottom * reference.h - ph;
  return [op, target.w - pw - op].map(v => {
    return new Rect(pw, ph, target.x + v, py);
  });
}

function layoutMidLayer(
  current: Rect,
  machine: Rect,
): (headI: number, move: boolean) => Rect {
  const headsStill = layoutHeads(machine, machine);
  const refHeadStill = headsStill[0];
  const platformsStill = layoutPlatforms(machine, machine);
  const refPlatformStill = platformsStill[0];
  const platformsCurrent = layoutPlatforms(current, machine);
  const refPlatformCurrent = platformsCurrent[0];

  const tempStartY = refHeadStill.y + refHeadStill.h;
  const tempEndY = refPlatformStill.y;
  const h = tempEndY - tempStartY;
  const y = refPlatformCurrent.y - h;

  const headCenters = headsStill.map(e => e.x + e.w / 2);
  const headDeltas = zipWith(tail(headCenters), headCenters, (a, b) => a - b);
  return (_headI: number, move: boolean) => {
    const headI = _headI - 1; // use zero based head indices, unlike rest of app
    const roundedI = Math.floor(Math.max(0, Math.min(COLUMN_COUNT - 2, headI)));
    const progress = headI - roundedI;
    const start = headCenters[roundedI];
    const delta = headDeltas[roundedI];
    let x = mix(start, start + delta, progress) + machine.x;
    const pi = +(headI + 0.5 > COLUMN_COUNT / 2);
    if (move) {
      x += platformsCurrent[pi].x - platformsStill[pi].x;
    }
    return new Rect(machine.w, h, x, y);
  };
}

function spaceEvenlyX(rects: Rect[]): Rect[] {
  const xMin = Math.min(...rects.map(r => r.x));
  const xMax = Math.max(...rects.map(r => r.x + r.w));
  const wTot = xMax - xMin;
  const wUsed = sum(rects.map(r => r.w));
  const space = (wTot - wUsed) / (rects.length - 1);
  let c = xMin;
  return rects.map(r => {
    const out = new Rect(r.w, r.h, c, r.y);
    c += r.w + space;
    return out;
  });
}

function derive(inputs: Inputs): Derived {
  const d = inputs.winW - 2 * consts.squarePadPx;
  const square = new Rect(d, d, consts.squarePadPx, consts.squareYPx);
  const machine = new Rect(
    inputs.winW,
    inputs.winW * consts.machineRatio,
    0,
    0,
  );
  const current = machine.mix(square, inputs.t);
  const headsMachine = layoutHeads(machine, machine);
  const headsSquare = spaceEvenlyX(layoutHeads(square, machine));
  const heads = zipWith(headsMachine, headsSquare, (a, b) =>
    a.mix(b, inputs.t),
  );
  const platforms = layoutPlatforms(current, machine);
  return {
    ...inputs,
    square,
    machine,
    current,
    heads,
    platforms,
    machineOpacity: Math.max(0, Math.min(1, easeInQuad(1 - inputs.t))),
    squareOpacity: Math.max(0, Math.min(1, easeInQuad(inputs.t))),
    midLayer: layoutMidLayer(current, machine),
  };
}

function getWrapperSize(derived: Derived) {
  return { width: derived.winW, height: derived.square.h };
}

export default class CompositePage extends React.Component<Props, State> {
  componentWillMount() {
    this.setState({ t: toSpringTarget(this.props.target) });
  }

  componentDidUpdate() {
    // When the page changes (column selection -> rating), a large
    // amount of elements need to be fully re-rendered (mostly in React).
    // On slow devices, this cuts into our animation time if we
    // start the animation at the same time as the page switches.
    // The below code lets the page render once before starting the animation.

    const t = toSpringTarget(this.props.target);
    if (t === this.state.t) {
      return;
    }
    requestAnimationFrame(() => this.setState({ t }));
  }

  render() {
    const {
      top,
      storeIndex,
      bottom,
      widthPx,
      heightPx,
      column,
      ratingStore,
    } = this.props;
    return (
      <div>
        <div>
          <div {...styles.top}>{s(storeIndex, top)}</div>
          <Title>&nbsp;</Title>
        </div>
        <Spring to={{ t: this.state.t }} config={springConfig}>
          {({ t }: { t: number }) => (
            <PlacementParent
              inputs={{ winW: widthPx, winH: heightPx, t }}
              derive={derive}
              getWrapperSize={getWrapperSize}
            >
              <Placed
                place={({ current }: Derived) => ({
                  ...current,
                  style: { backgroundColor: colors.machineDark },
                })}
              />
              <Machine column={column} stopPour={t !== 0} />
              <RatingSquare store={ratingStore} />
            </PlacementParent>
          )}
        </Spring>
        <div>{bottom}</div>
      </div>
    );
  }
}
