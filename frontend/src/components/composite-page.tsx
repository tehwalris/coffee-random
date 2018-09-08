import * as React from "react";
import { css } from "glamor";
import { RatingStore } from "../store";
import { Spring } from "react-spring";
import Title from "./title";
import { ANIMATION_SLOWDOWN } from "../util";
import PlacementParent from "./placement-parent";
import Machine from "./machine";
import RatingSquare from "./rating-square";
import Placed from "./placed";
import { colors, sizes, springConfigMain } from "../style";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { layout, LayoutOutputs } from "../layout-composite-page";

// CompositePage brings together the Machine and RatingSquare
// components, with support for morphing between them.
// It also positions and transitions between extra elements on the top
// and bottom of the page (eg. title), since the timing
// and positioning of these is linked to the morph animation.

const SECTION_FADE_TIME_MS = 150 * ANIMATION_SLOWDOWN;

export enum Target {
  Machine,
  Square,
}

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

    ".fade-enter": { opacity: 0 },
    ".fade-enter-active": {
      opacity: 1,
      transition: `opacity ${SECTION_FADE_TIME_MS}ms ease-in-out`,
    },
    ".fade-exit": { opacity: 1 },
    ".fade-exit-active": {
      opacity: 0,
      transition: `opacity ${SECTION_FADE_TIME_MS}ms ease-in-out`,
    },
  }),
};

const fadingSection = (k: React.Key, c: React.ReactChild) => (
  <TransitionGroup>
    {[
      <CSSTransition key={k} classNames="fade" timeout={SECTION_FADE_TIME_MS}>
        <div {...styles.section}>{c}</div>
      </CSSTransition>,
    ]}
  </TransitionGroup>
);

function toSpringTarget(target: Target): number {
  return +(target === Target.Square);
}

function getWrapperSize(derived: LayoutOutputs) {
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
          <div {...styles.top}>{fadingSection(storeIndex, top)}</div>
          <Title>&nbsp;</Title>
        </div>
        <Spring to={{ t: this.state.t }} config={springConfigMain}>
          {({ t }: { t: number }) => (
            <PlacementParent
              inputs={layout({ winW: widthPx, winH: heightPx, t })}
              getWrapperSize={getWrapperSize}
            >
              <Placed
                place={({ winW, machine }: LayoutOutputs) => ({
                  x: 0,
                  y: machine.y + machine.h,
                  w: winW,
                  h: winW,
                  style: {
                    pointerEvents: t > 0 ? "none" : undefined,
                  },
                })}
              >
                {fadingSection(storeIndex, bottom)}
              </Placed>
              <Placed
                place={({ current }: LayoutOutputs) => ({
                  ...current,
                  style: {
                    backgroundColor: colors.machineDark,
                    boxShadow: [
                      4 *
                        Math.max(0, Math.min(0.25, t)) *
                        sizes.shadow.offsetXPx +
                        "px",
                      sizes.shadow.offsetYPx + "px",
                      sizes.shadow.blurPx + "px",
                      `rgba(0, 0, 0, ${sizes.shadow.opacity})`,
                    ].join(" "),
                  },
                })}
              />
              <Machine
                column={column}
                stopPour={t > 0.1}
                stopEverything={t === 1}
              />
              <RatingSquare
                store={ratingStore}
                pointerEvents={t > 0}
                stopInteraction={t === 0 || (t < 0.9 && this.state.t === 1)}
              />
            </PlacementParent>
          )}
        </Spring>
      </div>
    );
  }
}
