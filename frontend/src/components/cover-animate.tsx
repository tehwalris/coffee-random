import * as React from "react";
import { css } from "glamor";
import Ratio from "../components/ratio";
import { sizes, colors } from "../style";
import posed from "react-pose";

export enum Target {
  Machine,
  Square,
}

interface Props {
  squareChild: React.ReactChild;
  machineChild: React.ReactChild;
  target: Target;
}

const styles = {
  outer: css({
    position: "relative",
    height: "100%",
    background: colors.machineDark,
  }),
  ratio: css({
    position: "relative",
    margin: `0 ${sizes.pagePaddingPx}px`,
  }),
  contentMachine: css({
    position: "absolute",
    top: "0",
    width: "100%",
  }),
  left: css({
    position: "absolute",
    width: "100%",
    height: "100%",
    top: "0",
    left: "-100%",
    background: colors.background,
  }),
  right: css({
    position: "absolute",
    width: "100%",
    height: "100%",
    top: "0",
    right: "-100%",
    background: colors.background,
  }),
  bottomMachine: css({
    position: "absolute",
    width: "100%",
    height: "100%",
    bottom: "-100%",
    background: colors.background,
  }),
  bottomSquare: css({
    position: "absolute",
    width: "200%",
    height: "100%",
    left: "-50%",
    bottom: "-100%",
    background: colors.background,
  }),
};

const machine = {
  Left: posed.div({
    enter: { x: "0px" },
    exit: { x: `${sizes.pagePaddingPx}px` },
  }),
  Right: posed.div({
    enter: { x: "0px" },
    exit: { x: `-${sizes.pagePaddingPx}px` },
  }),
  BottomMachine: posed.div({
    enter: { y: "-55%" },
    exit: { y: "0%" },
  }),
};

const square = {
  Left: posed.div({
    enter: { x: `${sizes.pagePaddingPx}px` },
    exit: { x: "0px" },
  }),
  Right: posed.div({
    enter: { x: `-${sizes.pagePaddingPx}px` },
    exit: { x: "0px" },
  }),
  BottomMachine: posed.div({
    enter: { y: "0%" },
    exit: { y: "-55%" },
  }),
};

export default ({ squareChild, machineChild, target }: Props) => {
  const e = target === Target.Machine ? machine : square;
  return (
    <Ratio width="100%" ratio={target === Target.Machine ? 0.45 : 1}>
      <Ratio width="100%" ratio={1}>
        <div {...styles.outer}>
          <div {...styles.ratio}>
            <Ratio width="100%" ratio={1}>
              {squareChild}
            </Ratio>
            <div {...styles.bottomSquare} />
          </div>
          <div {...styles.contentMachine}>
            <Ratio width="100%" ratio={0.45}>
              {machineChild}
            </Ratio>
          </div>
          <e.Left pose="enter" {...styles.left} />
          <e.Right {...styles.right} />
          <e.BottomMachine {...styles.bottomMachine} />
        </div>
      </Ratio>
    </Ratio>
  );
};
