import * as React from "react";
import posed, { PoseGroup } from "react-pose";
import CoverAnimate, { Target } from "./cover-animate";
import { css } from "glamor";
import Machine from "./machine";
import { RatingStore } from "../store";
import RatingSquare from "./rating-square";
import { Spring, config as springConfigs } from "react-spring";
import Title from "../components/title";
import { RENDER_DEBUG } from "../util";

interface Props {
  top: React.ReactChild;
  bottom: React.ReactChild;
  target: Target;
  column?: number;
  storeIndex: number;
  ratingStore?: RatingStore;
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
    const { top, bottom, column, storeIndex, ratingStore } = this.props;
    return (
      <div>
        <div>
          <div {...styles.top}>{s(storeIndex, top)}</div>
          <Title>&nbsp;</Title>
        </div>
        <Spring to={{ t: this.state.t }} config={springConfig}>
          {({ t }: { t: number }) => (
            <CoverAnimate
              squareChild={
                <div {...styles.top}>
                  {<RatingSquare store={ratingStore} />}
                </div>
              }
              machineChild={<Machine column={column} />}
              postMachineChild={
                <div {...styles.bottom}>{s(storeIndex, bottom)}</div>
              }
              t={t}
            />
          )}
        </Spring>
      </div>
    );
  }
}
