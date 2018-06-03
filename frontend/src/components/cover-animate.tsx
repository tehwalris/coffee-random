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
    pointerEvents: "none",
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

const p = {
  Left: posed.div({
    machine: { x: "0px" },
    square: { x: `${sizes.pagePaddingPx}px` },
  }),
  Right: posed.div({
    machine: { x: "0px" },
    square: { x: `-${sizes.pagePaddingPx}px` },
  }),
  BottomMachine: posed.div({
    machine: { y: "-55%" },
    square: { y: "0%" },
  }),
};

export default ({ squareChild, machineChild, target }: Props) => {
  const pose = target === Target.Machine ? "machine" : "square";
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
          <p.Left pose={pose} {...styles.left} />
          <p.Right pose={pose} {...styles.right} />
          <p.BottomMachine pose={pose} {...styles.bottomMachine} />
        </div>
      </Ratio>
    </Ratio>
  );
};
