import * as React from "react";
import { css } from "glamor";
import Ratio from "../components/ratio";
import { sizes, colors } from "../style";
import { mix, easeInQuad } from "../util";

export enum Target {
  Machine,
  Square,
}

interface Props {
  squareChild: React.ReactChild;
  machineChild: React.ReactChild;
  postMachineChild: React.ReactChild;
  t: number; // [0, 1] [machine, square]
}

const styles = {
  outer: css({
    position: "relative",
    height: "100%",
    background: colors.machineDark,
    willChange: "transform",
  }),
  ratio: css({
    position: "relative",
    margin: `0 ${sizes.pagePaddingPx}px`,
  }),
  contentSquare: css({
    willChange: "opacity",
  }),
  contentMachine: css({
    position: "absolute",
    top: "0",
    width: "100%",
    pointerEvents: "none",
    willChange: "transform",
  }),
  contentPost: css({
    position: "absolute",
    top: "0",
    width: "100%",
    height: "0",
    overflow: "visible",
  }),
  contentPostFiller: css({
    pointerEvents: "none",
  }),
  left: css({
    position: "absolute",
    width: "100%",
    height: "100%",
    top: "0",
    left: "-100%",
    background: colors.background,
    willChange: "transform",
  }),
  right: css({
    position: "absolute",
    width: "100%",
    height: "100%",
    top: "0",
    right: "-100%",
    background: colors.background,
    willChange: "transform",
  }),
  bottomMachine: css({
    position: "absolute",
    width: "100%",
    height: "100%",
    bottom: "-100%",
    background: colors.background,
    willChange: "transform",
  }),
  bottomSquare: css({
    position: "absolute",
    width: "200%",
    height: "100%",
    left: "-50%",
    bottom: "-100%",
    background: colors.background,
    willChange: "transform",
  }),
};

export default ({ squareChild, machineChild, postMachineChild, t }: Props) => {
  const d = {
    outer: { transform: `translateY(-${t * 15}%)` },
    left: { transform: `translateX(${t * sizes.pagePaddingPx}px)` },
    right: { transform: `translateX(-${t * sizes.pagePaddingPx}px)` },
    bottomMachine: { transform: `translateY(${mix(-55, 0, t)}%)` },
    contentSquare: { opacity: easeInQuad(t) },
    contentMachine: {
      opacity: easeInQuad(1 - t),
      transform: `translateY(${t * 45}%)`,
    },
  };
  return (
    <Ratio width="100%" ratio={1}>
      <div {...styles.outer} style={d.outer}>
        <div {...styles.ratio}>
          <div {...styles.contentSquare} style={d.contentSquare}>
            <Ratio width="100%" ratio={1}>
              {squareChild}
            </Ratio>
          </div>
          <div {...styles.bottomSquare} />
        </div>
        <div {...styles.contentMachine} style={d.contentMachine}>
          <Ratio width="100%" ratio={0.45}>
            {machineChild}
          </Ratio>
        </div>
        <div {...styles.left} style={d.left} />
        <div {...styles.right} style={d.right} />
        <div {...styles.bottomMachine} style={d.bottomMachine} />
        <div {...styles.contentPost}>
          <div {...styles.contentPostFiller}>
            <Ratio width="100%" ratio={0.45} />
          </div>
          {postMachineChild}
        </div>
      </div>
    </Ratio>
  );
};
