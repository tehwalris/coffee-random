import * as React from "react";
import posed from "react-pose";
import CoverAnimate, { Target } from "./cover-animate";
import { css } from "glamor";
import Machine from "./machine";
import { RatingStore } from "../store";
import RatingSquare from "./rating-square";

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

const Child = posed.div({
  visible: { opacity: 1, height: "100%" },
  hidden: { opacity: 0, height: "100%" },
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
    <CoverAnimate
      squareChild={
        <Child
          pose={target === Target.Square ? "visible" : "hidden"}
          {...styles.top}
        >
          {ratingStore && <RatingSquare store={ratingStore} />}
        </Child>
      }
      machineChild={
        <Child pose={target === Target.Machine ? "visible" : "hidden"}>
          <Machine column={column} />
        </Child>
      }
      target={target}
    />
    <div {...styles.bottom}>
      <Section>{bottom}</Section>
    </div>
  </div>
);
