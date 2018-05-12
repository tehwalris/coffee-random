import * as React from "react";
import { css } from "glamor";
import { colors } from "../style";
import Ratio from "../components/ratio";
import Head from "./head";
import Cup from "./cup";
import { mix } from "../util";

export interface Props {
  arrowPos: number; // 0 is left head, 3 is right head, any float values are allowed
  heads: Heads;
  coffee: number; // [0, 1] // 0 - no coffee, 0.5 - full coffee, 1 - no coffee (0.25 some coffee from the top)
  blonding: number; // [0, 1] // 0 - dark coffee, 1 - blonde coffee
}

// see head.tsx
export interface HeadProps {
  door: number;
  light: boolean;
}

export type Heads = [HeadProps, HeadProps, HeadProps, HeadProps];

const HEAD_H_PADDING_PERCENT = 2;
const TRIANGLE_PX = 15;
const STAND_OFFSET_PERCENT = 75;
const CUP_WIDTH_PERCENT = 8;
const COFFEE_WIDTH_PERCENT = 1;
const COFFEE_TOP = 43;
const COFFEE_BOTTOM = 64;

const styles = {
  body: css({
    position: "relative",
    height: "100%",
    backgroundColor: colors.machineDark,
    margin: "40px 0",
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
    width: "100%",
    bottom: `${100 - STAND_OFFSET_PERCENT}%`,
  }),
  coffee: (t: number, b: number) => {
    const top = mix(COFFEE_TOP, COFFEE_BOTTOM, Math.max(0, 2 * t - 1));
    const bottom = mix(COFFEE_TOP, COFFEE_BOTTOM, Math.min(1, 2 * t));
    const color = colors.coffeeDarkRGB.map((v, i) =>
      mix(v, colors.coffeeLightRGB[i], b),
    );
    return css({
      willChange: "transform",
      position: "absolute",
      top: `${top}%`,
      width: `${COFFEE_WIDTH_PERCENT}%`,
      height: `${bottom - top}%`,
      marginLeft: `${-0.5 * COFFEE_WIDTH_PERCENT}%`,
      background: `rgb(${color.map(Math.floor).join(", ")})`,
    });
  },
};

const Triangle = ({ down }: { down: boolean }) => (
  <svg viewBox="0,0,1,1" {...styles.triangleSVG(down)}>
    <polygon points="0.5 0.42, 1 1, 0 1" {...styles.triangePoly} />
  </svg>
);

export default ({ arrowPos, heads, coffee, blonding }: Props) => (
  <div {...styles.body}>
    <Ratio width="100%" ratio={0.45}>
      <div {...styles.layerMid(centerOfHeadPercent(arrowPos))}>
        <Triangle down={true} />
        <div {...styles.coffee(coffee, blonding)} />
        <div {...styles.cupWrapper}>
          <Cup width={`${CUP_WIDTH_PERCENT}%`} tilt="15deg" center />
        </div>
        <Triangle down={false} />
      </div>
      <div {...styles.layerTop}>
        <div {...styles.row} {...styles.heads}>
          {heads.map((e, i) => (
            <Head key={i} width="17%" door={e.door} light={e.light} />
          ))}
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
