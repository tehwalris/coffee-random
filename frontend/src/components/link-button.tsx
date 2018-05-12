import * as React from "react";
import { css } from "glamor";
import { sizes } from "../style";

const styles = {
  button: css({
    display: "inline-block",
    padding: `${sizes.spacingPx / 2}px`,
    fontSize: sizes.uiFontSizeSmall,
    border: "none",
    backgroundColor: "transparent",
    color: "inherit",
  }),
};

export default (props: React.InputHTMLAttributes<HTMLButtonElement>) => (
  <button {...styles.button} {...props} />
);
