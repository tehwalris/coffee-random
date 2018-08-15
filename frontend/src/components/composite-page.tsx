import * as React from "react";
import posed, { PoseGroup } from "react-pose";
import { Target } from "./cover-animate";
import { css } from "glamor";
import { RatingStore } from "../store";
import { Spring, config as springConfigs } from "react-spring";
import Title from "./title";
import { RENDER_DEBUG, mix } from "../util";
import PlacementParent, { Placement } from "./placement-parent";
import Placed from "./placed";
import Machine from "./machine";

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
  current: {
    whole: Rect;
    machineLeft: Rect;
    machineRight: Rect;
  };
  heads: [Rect, Rect, Rect, Rect];
}

const consts = {
  squarePadPx: 25,
  squareYPx: -50,
  machineRatio: 0.45,
  machinePaddingHOuterPx: 18,
  machinePaddingHInnerPx: 15,
  headWPartOfHalf: 0.42,
};

function derive(inputs: Inputs): Derived {
  const d = inputs.winW - 2 * consts.squarePadPx;
  const square = new Rect(d, d, consts.squarePadPx, consts.squareYPx);
  const machine = new Rect(
    inputs.winW,
    inputs.winW * consts.machineRatio,
    0,
    0,
  );
  const currentWhole = machine.mix(square, inputs.t);
  const machineHalfW =
    (machine.w -
      2 * consts.machinePaddingHOuterPx -
      2 * consts.machinePaddingHInnerPx) /
    2;
  const machineLeft = new Rect(
    machineHalfW,
    machine.h,
    currentWhole.x + consts.machinePaddingHOuterPx,
    currentWhole.y,
  );
  const machineRight = new Rect(
    machineHalfW,
    machine.h,
    currentWhole.x +
      currentWhole.w -
      machineHalfW -
      consts.machinePaddingHOuterPx,
    currentWhole.y,
  );
  const heads: Rect[] = [
    [machineLeft, "left"],
    [machineLeft, "right"],
    [machineRight, "left"],
    [machineRight, "right"],
  ].map(([outer, side]: [Rect, "left" | "right"]) => {
    const w = outer.w * consts.headWPartOfHalf;
    const x = outer.x + (side === "left" ? 0 : outer.w - w);
    return new Rect(w, outer.h, x, outer.y);
  });
  return {
    ...inputs,
    square,
    machine,
    current: {
      whole: currentWhole,
      machineLeft,
      machineRight,
    },
    heads: heads as [Rect, Rect, Rect, Rect],
  };
}

function getWrapperSize(derived: Derived) {
  return { width: derived.winW, height: derived.square.h };
}

const place: { [key: string]: (derived: Derived) => Placement } = {
  demoSquare: ({ square }) => ({
    ...square,
    style: { background: "green" },
  }),
  demoMachine: ({ machine }) => ({
    ...machine,
    style: { background: "blue" },
  }),
  demoCurrent: ({ current }) => ({
    ...current.whole,
    style: { background: "red" },
  }),
};

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
    const { top, storeIndex, bottom, widthPx, heightPx } = this.props;
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
              <Placed key="demoSquare" place={place.demoSquare} />
              <Placed key="demoCurrent" place={place.demoCurrent} />
              <Placed key="demoMachine" place={place.demoMachine} />
              <Machine />
            </PlacementParent>
          )}
        </Spring>
        <div>{bottom}</div>
      </div>
    );
  }
}
