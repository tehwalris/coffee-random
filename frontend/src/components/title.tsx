import * as React from "react";
import { css } from "glamor";
import { sizes } from "../style";

interface Props {
  children: React.ReactChild | React.ReactChild[];
}

const styles = {
  title: css({
    margin: `${sizes.spacingPx[3]}px ${sizes.spacingPx[1]}px`,
    textAlign: "center",
    fontSize: sizes.titleFontSize,
    lineHeight: "1.25em",
    height: "2.5em",
  }),
};

// Title is always fixed to 2 lines high, no matter what content it has
export default ({ children }: Props) => <div {...styles.title}>{children}</div>;
