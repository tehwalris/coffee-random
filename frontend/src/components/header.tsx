import * as React from "react";
import { css } from "glamor";
import { colors } from "../style";
import Cup from "./cup";

const styles = {
  wrapper: css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "130px",
    paddingBottom: "5px",
    backgroundColor: colors.machine,
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
    <Cup widthPx={60} />
  </div>
);
