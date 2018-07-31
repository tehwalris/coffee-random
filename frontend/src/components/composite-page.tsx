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
  : { tension: 230, friction: 17 };

export default ({
  top,
  bottom,
  target,
  column,
  storeIndex,
  ratingStore,
}: Props) => (
  <div>
    <div>
      <div {...styles.top}>{s(storeIndex, top)}</div>
      <Title>&nbsp;</Title>
    </div>
    <Spring to={{ t: +(target === Target.Square) }} config={springConfig}>
      {({ t }: { t: number }) => (
        <CoverAnimate
          squareChild={
            <div {...styles.top}>{<RatingSquare store={ratingStore} />}</div>
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
