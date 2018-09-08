import * as React from "react";
import { css } from "glamor";
import { colors, sizes, smallDeviceMediaQuery } from "../style";
import Cup from "./cup";

// Header is the "coffee-random" header for the login page.

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

    [smallDeviceMediaQuery]: {
      height: "120px",
      fontSize: sizes.smallDevice.titleFontSize,
    },
  }),
  picture: css({
    position: "absolute",
    top: "0",
    bottom: sizes.spacingPx[0],
    right: sizes.spacingPx[1],
    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    [smallDeviceMediaQuery]: {
      right: sizes.spacingPx[0],
    },

    [`@media(max-width: calc(${sizes.smallDevice.titleFontSize} * 7.5))`]: {
      opacity: 0,
    },
  }),
  coffee: css({
    flexGrow: "1",
    width: "4px",
    background: colors.coffee,

    [smallDeviceMediaQuery]: {
      width: "3px",
    },
  }),
  cupWrapper: css({
    width: "40px",

    [smallDeviceMediaQuery]: {
      width: "30px",
    },
  }),
  textCoffee: css({
    position: "absolute",
    top: sizes.spacingPx[1],
    left: sizes.spacingPx[1],

    [smallDeviceMediaQuery]: {
      top: sizes.spacingPx[0],
      left: sizes.spacingPx[0],
    },
  }),
  textRandom: css({
    position: "absolute",
    top: `calc(${sizes.spacingPx[1]}px + 1em)`,
    left: `calc(${sizes.spacingPx[1]}px + 1.2em)`,

    [smallDeviceMediaQuery]: {
      top: `calc(${sizes.spacingPx[0]}px + 1em)`,
      left: `calc(${sizes.spacingPx[0]}px + 1.2em)`,
    },
  }),
};

export default () => (
  <div {...styles.wrapper}>
    <div {...styles.picture}>
      <div {...styles.coffee} />
      <div {...styles.cupWrapper}>
        <Cup width="100%" />
      </div>
    </div>
    <div {...styles.textCoffee}>coffee-</div>
    <div {...styles.textRandom}>random</div>
  </div>
);
