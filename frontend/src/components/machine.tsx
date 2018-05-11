import * as React from "react";
import { css } from "glamor";
import { colors } from "../style";
import Ratio from "../components/ratio";
import Head from "./head";

const HEAD_H_PADDING_PERCENT = 2;
const TRIANGLE_PX = 15;

interface TriangleProps {
  offsetPercent: number;
  pointDown: boolean;
}

const styles = {
  body: css({
    position: "relative",
    width: "100%",
    height: "100%",
    backgroundColor: colors.machineDark,
  }),
  row: css({
    position: "absolute",
    width: "100%",
    top: "15%",
    display: "flex",
    justifyContent: "space-around",
    padding: `0 ${HEAD_H_PADDING_PERCENT}%`,
  }),
  heads: css({
    top: "15%",
  }),
  stands: css({
    top: "75%",
    padding: `0 1%`,
  }),
  stand: css({
    height: "100%",
    backgroundColor: colors.machineLight,
  }),
  arrowRow: css({
    position: "relative",
    height: `${TRIANGLE_PX}px`,
    margin: "3px 0",
  }),
  triangleSVG: (p: TriangleProps) =>
    css({
      position: "absolute",
      left: `${p.offsetPercent}%`,
      marginLeft: `${-0.5 * TRIANGLE_PX}px`,
      width: `${TRIANGLE_PX}px`,
      height: `${TRIANGLE_PX}px`,
      transform: p.pointDown ? "rotate(180deg)" : undefined,
    }),
  triangePoly: css({
    fill: colors.machineDark,
  }),
};

const Triangle = (p: TriangleProps) => (
  <svg viewBox="0,0,1,1" {...styles.triangleSVG(p)}>
    <polygon points="0.5 0.42, 1 1, 0 1" {...styles.triangePoly} />
  </svg>
);

export default () => (
  <div>
    <div {...styles.arrowRow}>
      <Triangle offsetPercent={centerOfHeadPercent(1)} pointDown={true} />
    </div>
    <Ratio width="100%" ratio={0.45}>
      <div {...styles.body}>
        <div {...styles.row} {...styles.heads}>
          {[0, 1, 2, 3].map(i => <Head key={i} width="17%" />)}
        </div>
        <div {...styles.row} {...styles.stands}>
          {[0, 1].map(i => (
            <Ratio key={i} width="42%" ratio={0.11}>
              <div {...styles.stand} />
            </Ratio>
          ))}
        </div>
      </div>
    </Ratio>
    <div {...styles.arrowRow}>
      <Triangle offsetPercent={centerOfHeadPercent(1)} pointDown={false} />
    </div>
  </div>
);

function centerOfHeadPercent(i: number): number {
  let p = HEAD_H_PADDING_PERCENT;
  return p + (100 - 2 * p) * ((i + 0.5) / 4);
}
