import * as React from "react";
import { css } from "glamor";
import Ratio from "../components/ratio";
import { sizes, colors } from "../style";
import { mix, easeInQuad, RENDER_DEBUG } from "../util";

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
    transformStyle: "preserve-3d",
  }),
  ratio: css({
    position: "relative",
    margin: `0 ${sizes.pagePaddingPx}px`,
    transformStyle: "preserve-3d",
  }),
  contentSquare: css({
    transform: RENDER_DEBUG ? "translateZ(5px)" : "translateZ(30px)",
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
    top: "45%",
    width: "100%",
    height: "100%",
    overflow: "visible",
    willChange: "transform",
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
    background: RENDER_DEBUG ? "red" : colors.background,
    opacity: RENDER_DEBUG ? 0.9 : undefined,
    willChange: "transform",
  }),
  right: css({
    position: "absolute",
    width: "100%",
    height: "100%",
    top: "0",
    right: "-100%",
    background: RENDER_DEBUG ? "green" : colors.background,
    opacity: RENDER_DEBUG ? 0.9 : undefined,
    willChange: "transform",
  }),
  bottomMachine: css({
    position: "absolute",
    width: "100%",
    height: "100%",
    bottom: "-100%",
    background: RENDER_DEBUG ? "blue" : colors.background,
    opacity: RENDER_DEBUG ? 0.6 : undefined,
    willChange: "transform",
    pointerEvents: "none",
  }),
  bottomSquare: css({
    position: "absolute",
    width: "200%",
    height: "100%",
    left: "-50%",
    bottom: "-100%",
    background: RENDER_DEBUG ? "yellow" : colors.background,
    opacity: RENDER_DEBUG ? 0.9 : undefined,
    willChange: "transform",
  }),
};

export default ({ squareChild, machineChild, postMachineChild, t }: Props) => {
  const r = (s: string) => (RENDER_DEBUG ? s : "");
  const d: { [key: string]: React.CSSProperties } = {
    outer: { transform: `translateY(-${t * 15}%)` },
    left: {
      transform: `translateX(${t * sizes.pagePaddingPx}px) ${r(
        "translateZ(10px)",
      )}`,
    },
    right: {
      transform: `translateX(-${t * sizes.pagePaddingPx}px) ${r(
        "translateZ(10px)",
      )}`,
    },
    bottomMachine: {
      transform: `translateY(${mix(-55, 0, t)}%) ${r("translateZ(20px)")}`,
    },
    contentSquare: {
      opacity: easeInQuad(t),
      pointerEvents: t < 0.5 ? "none" : undefined,
    },
    contentMachine: {
      opacity: easeInQuad(1 - t),
      transform: `translateY(${t * 45}%)`,
    },
    contentPost: { transform: `translateY(${t * 20}%)` },
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
        <div {...styles.contentPost} style={d.contentPost}>
          {postMachineChild}
        </div>
      </div>
    </Ratio>
  );
};
