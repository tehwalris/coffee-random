import * as React from "react";
import { css } from "glamor";
import { colors, sizes } from "../style";
import Cup from "./cup";

const styles = {
  wrapper: css({
    position: "relative",
    height: "160px",
    fontSize: sizes.titleFontSize,
    color: "white",
    backgroundColor: colors.machineDark,
    boxShadow: [
      0,
      sizes.shadow.offsetYPx + "px",
      sizes.shadow.blurPx + "px",
      `rgba(0, 0, 0, ${sizes.shadow.opacity})`,
    ].join(" "),
  }),
  picture: css({
    position: "absolute",
    top: "0",
    bottom: sizes.spacingPx[0],
    right: sizes.spacingPx[1],
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }),
  coffee: css({
    flexGrow: "1",
    width: "4px",
    background: colors.coffee,
  }),
  textCoffee: css({
    position: "absolute",
    top: sizes.spacingPx[1],
    left: sizes.spacingPx[1],
  }),
  textRandom: css({
    position: "absolute",
    top: `calc(${sizes.spacingPx[1]}px + 1em)`,
    left: `calc(${sizes.spacingPx[1]}px + 1.2em)`,
  }),
};

export default () => (
  <div {...styles.wrapper}>
    <div {...styles.picture}>
      <div {...styles.coffee} />
      <Cup width="40px" />
    </div>
    <div {...styles.textCoffee}>coffee-</div>
    <div {...styles.textRandom}>random</div>
  </div>
);
