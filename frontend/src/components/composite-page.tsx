import * as React from "react";
import posed from "react-pose";
import CoverAnimate, { Target } from "./cover-animate";
import { css } from "glamor";
import Machine from "./machine";
import { RatingStore } from "../store";
import RatingSquare from "./rating-square";
import { Spring } from "react-spring";

interface Props {
  top: React.ReactChild;
  bottom: React.ReactChild;
  target: Target;
  column: number;
  storeIndex: number;
  ratingStore?: RatingStore;
}

const Section = posed.div({
  enter: { opacity: 1 },
  exit: { opacity: 0 },
});

const styles = {
  top: css({
    width: "100%",
    height: "100%",
  }),
  bottom: css({
    position: "relative",
  }),
};

export default ({
  top,
  bottom,
  target,
  column,
  storeIndex,
  ratingStore,
}: Props) => (
  <div>
    <Section>{top}</Section>
    <Spring to={{ t: +(target === Target.Square) }}>
      {({ t }: { t: number }) => (
        <CoverAnimate
          squareChild={
            <div {...styles.top}>{<RatingSquare store={ratingStore} />}</div>
          }
          machineChild={<Machine column={column} />}
          t={t}
          postMachineChild={<Section>{bottom}</Section>}
        />
      )}
    </Spring>
    <div {...styles.bottom} />
  </div>
);
