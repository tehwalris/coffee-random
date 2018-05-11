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
    backgroundColor: colors.machineDark,
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
