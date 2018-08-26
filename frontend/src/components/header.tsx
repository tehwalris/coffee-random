import * as React from "react";
import { css } from "glamor";
import { colors, sizes } from "../style";
import Cup from "./cup";

const styles = {
  wrapper: css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "130px",
    paddingBottom: "5px",
    backgroundColor: colors.machineDark,
    boxShadow: [
      0,
      sizes.shadow.offsetYPx + "px",
      sizes.shadow.blurPx + "px",
      `rgba(0, 0, 0, ${sizes.shadow.opacity})`,
    ].join(" "),
  }),
  coffee: css({
    flexGrow: "1",
    width: "4px",
    background: colors.coffee,
  }),
};

export default () => (
  <div {...styles.wrapper}>
    <div {...styles.coffee} />
    <Cup width="60px" />
  </div>
);
