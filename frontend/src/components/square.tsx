import * as React from "react";
import { css } from "glamor";

interface Props {
  children?: React.ReactChild | React.ReactChild[];
  width: string;
}

// Based on https://spin.atomicobject.com/2015/07/14/css-responsive-square/
const styles = (width: string) => ({
  outer: css({
    position: "relative",
    width,
  }),
  after: css({
    paddingBottom: "100%",
  }),
  inner: css({
    position: "absolute",
    width: "100%",
    height: "100%",
  }),
});

export default ({ children, width }: Props) => (
  <div {...styles(width).outer}>
    <div {...styles(width).inner}>{children}</div>
    <div {...styles(width).after} />
  </div>
);
