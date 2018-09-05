import * as React from "react";
import { css } from "glamor";
import { sizes, smallDeviceMediaQuery } from "../style";

interface Props {
  children: React.ReactChild | React.ReactChild[];
}

// TODO fix this
// HACK the text seems to have some padding naturally - cancel it out
const TEXT_SELF_PADDING_PX = 7;

const styles = {
  title: css({
    margin: `${sizes.spacingPx[3] - 2 * TEXT_SELF_PADDING_PX}px ${
      sizes.spacingPx[1]
    }px`,
    textAlign: "center",
    fontSize: sizes.titleFontSize,
    lineHeight: "1.25em",
    height: "2.5em",

    [smallDeviceMediaQuery]: {
      margin: `${sizes.spacingPx[2] - TEXT_SELF_PADDING_PX}px ${
        sizes.spacingPx[0]
      }px`,
      fontSize: sizes.smallDevice.titleFontSize,
    },
  }),
};

// Title is always fixed to 2 lines high, no matter what content it has
export default ({ children }: Props) => <div {...styles.title}>{children}</div>;
