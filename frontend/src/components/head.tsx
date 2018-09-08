import * as React from "react";
import { css } from "glamor";
import Ratio from "./ratio";
import { colors } from "../style";
import { mix } from "../util";

// Head is a stylized coffee machine brew head as a SVG.
// The door and leftmost light are controllable.

interface Props {
  width: string;
  door: number; // [0, 1] (0 - raised/open, 1 - lowered/closed)
  light?: boolean; // true is on
}

const styles = {
  svg: css({
    width: "100%",
    height: "100%",
  }),
  path: css({
    fill: colors.machineLight,
  }),
};

const RECT_UP_Y = 0.22;
const RECT_DOWN_Y = 0.35;
export const HEAD_RATIO = 0.79;

export default class Head extends React.PureComponent<Props> {
  render() {
    const { width, light, door } = this.props;
    return (
      <Ratio width={width} ratio={HEAD_RATIO}>
        <svg viewBox="0,0,1,0.79" {...styles.svg}>
          <rect
            width="0.6"
            height="0.5"
            x="0.25"
            y={RECT_UP_Y}
            fill={colors.machineDark}
          />
          <rect
            width="0.5"
            height="0.2"
            x="0.25"
            y={mix(RECT_UP_Y, RECT_DOWN_Y, door)}
            fill={colors.machineMediumLight}
          />
          <rect
            width="0.6"
            height="0.2"
            x="0.25"
            y={RECT_UP_Y}
            fill={colors.machineDark}
          />
          <path
            d="m 0.5,0 a 0.5000072,0.5000072 0 0 0 -0.5,0.5 0.5000072,0.5000072 0 0 0 0.09485,0.291924 h 0.810474 a 0.5000072,0.5000072 0 0 0 0.09468,-0.291924 0.5000072,0.5000072 0 0 0 -0.5,-0.5 z m 0,0.06656 a 0.05547113,0.05547113 0 0 1 0.05548,0.05544 0.05547113,0.05547113 0 0 1 -0.05548,0.05548 0.05547113,0.05547113 0 0 1 -0.05548,-0.05548 0.05547113,0.05547113 0 0 1 0.05548,-0.05544 z m -0.269221,0.120237 a 0.05547113,0.05547113 0 0 1 0.05548,0.05548 0.05547113,0.05547113 0 0 1 -0.05548,0.05548 0.05547113,0.05547113 0 0 1 -0.05548,-0.05548 0.05547113,0.05547113 0 0 1 0.05548,-0.05548 z m 0.53647,2.44e-4 a 0.05547113,0.05547113 0 0 1 0.05548,0.05544 0.05547113,0.05547113 0 0 1 -0.05548,0.05548 0.05547113,0.05547113 0 0 1 -0.05548,-0.05548 0.05547113,0.05547113 0 0 1 0.05548,-0.05544 z m -0.466887,0.24681 h 0.399277 v 0.103745 h -0.399277 z"
            {...styles.path}
          />
          <circle
            r="0.06"
            cx="0.232"
            cy="0.24"
            fill={light ? "white" : "transparent"}
            stroke={light ? colors.machineMediumLight : undefined}
            strokeWidth="0.01"
          />
        </svg>
      </Ratio>
    );
  }
}
