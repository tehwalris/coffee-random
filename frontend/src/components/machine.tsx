import * as React from "react";
import { css } from "glamor";
import { colors } from "../style";
import Ratio from "../components/ratio";
import Head from "./head";
import Cup from "./cup";

interface Props {
  arrowPos: number; // 0 is left head, 3 is right head, any float values are allowed
}

const HEAD_H_PADDING_PERCENT = 2;
const TRIANGLE_PX = 15;
const STAND_OFFSET_PERCENT = 75;
const CUP_WIDTH_PX = 30;

const styles = {
  body: css({
    position: "relative",
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
    top: `${STAND_OFFSET_PERCENT}%`,
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
  triangleSVG: (down: boolean) =>
    css({
      position: "absolute",
      [down ? "top" : "bottom"]: "-15px",
      marginLeft: `${-0.5 * TRIANGLE_PX}px`,
      width: `${TRIANGLE_PX}px`,
      height: `${TRIANGLE_PX}px`,
      transform: down ? "rotate(180deg)" : undefined,
    }),
  triangePoly: css({
    fill: colors.machineDark,
  }),
  layerMid: (offsetPercent: number) =>
    css({
      position: "absolute",
      width: "100%",
      height: "100%",
      willChange: "transform",
      transform: `translateX(${offsetPercent}%)`,
    }),
  layerTop: css({
    height: "100%",
    position: "relative",
    willChange: "transform",
  }),
  cupWrapper: css({
    position: "absolute",
    bottom: `${100 - STAND_OFFSET_PERCENT}%`,
    left: `${-0.5 * CUP_WIDTH_PX}px`,
  }),
};

const Triangle = ({ down }: { down: boolean }) => (
  <svg viewBox="0,0,1,1" {...styles.triangleSVG(down)}>
    <polygon points="0.5 0.42, 1 1, 0 1" {...styles.triangePoly} />
  </svg>
);

export default ({ arrowPos }: Props) => (
  <div {...styles.body}>
    <Ratio width="100%" ratio={0.45}>
      <div {...styles.layerMid(centerOfHeadPercent(arrowPos))}>
        <Triangle down={true} />
        <div {...styles.cupWrapper}>
          <Cup widthPx={CUP_WIDTH_PX} tilt="15deg" />
        </div>
        <Triangle down={false} />
      </div>
      <div {...styles.layerTop}>
        <div {...styles.row} {...styles.heads}>
          <Head width="17%" door={0} />
          <Head width="17%" door={0.6} light={true} />
          <Head width="17%" door={0} />
          <Head width="17%" door={0} />
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
  </div>
);

function centerOfHeadPercent(i: number): number {
  let p = HEAD_H_PADDING_PERCENT;
  return p + (100 - 2 * p) * ((i + 0.5) / 4);
}
