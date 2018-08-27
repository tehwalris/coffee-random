import * as React from "react";
import { css } from "glamor";

const styles = {
  button: css({
    display: "inline-block",
    border: "none",
    backgroundColor: "transparent",
    color: "inherit",

    ":focus": {
      outline: "none",
    },

    ":active": {
      textDecoration: "underline",
    },
  }),
};

export default (props: React.InputHTMLAttributes<HTMLButtonElement>) => (
  <button {...styles.button} {...props} />
);
