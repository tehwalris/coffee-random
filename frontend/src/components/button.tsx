import * as React from "react";
import { css } from "glamor";
import { colors, sizes } from "../style";

const styles = {
  button: css({
    display: "block",
    width: sizes.buttonWidthPx,
    height: sizes.inputHeightPx,
    fontSize: sizes.uiFontSize,
    border: "none",
    backgroundColor: colors.primaryBackground,
    color: colors.primaryContent,
    boxShadow: [
      sizes.shadow.offsetXPx + "px",
      sizes.shadow.offsetYPx + "px",
      sizes.shadow.blurPx + "px",
      `rgba(0, 0, 0, ${sizes.shadow.opacity})`,
    ].join(" "),
  }),
};

export default (props: React.InputHTMLAttributes<HTMLButtonElement>) => (
  <button {...styles.button} {...props} />
);
