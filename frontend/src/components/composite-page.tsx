import * as React from "react";
import posed from "react-pose";
import CoverAnimate, { Target } from "./cover-animate";
import { css } from "glamor";

interface Props {
  top: React.ReactChild;
  bottom: React.ReactChild;
  target: Target;
}

const Section = posed.div({
  enter: { opacity: 1 },
  exit: { opacity: 0 },
});

const styles = {
  bottom: css({
    position: "relative",
  }),
};

export default ({ top, bottom, target }: Props) => (
  <div>
    <Section>{top}</Section>
    <CoverAnimate
      squareChild={<div>square</div>}
      machineChild={<div>machine</div>}
      target={target}
    />
    <div {...styles.bottom}>
      <Section>{bottom}</Section>
    </div>
  </div>
);
