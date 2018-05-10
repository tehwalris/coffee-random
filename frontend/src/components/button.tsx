import * as React from "react";
import { css } from "glamor";
import { colors, sizes } from "../style";

const styles = {
  button: css({
    display: "block",
    width: 3 * sizes.inputHeightPx,
    height: sizes.inputHeightPx,
    fontSize: sizes.uiFontSize,
    border: `${sizes.border} solid ${colors.primaryBorder}`,
    backgroundColor: colors.primaryBackground,
    color: colors.primaryContent,
  }),
};

export default (props: React.InputHTMLAttributes<HTMLButtonElement>) => (
  <button {...styles.button} {...props} />
);
