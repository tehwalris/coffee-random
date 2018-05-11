// Based on https://spin.atomicobject.com/2015/07/14/css-responsive-square/

import * as React from "react";
import { css } from "glamor";

interface Props {
  children?: React.ReactChild | React.ReactChild[];
  width: string;
  ratio: number; // height / width
}

export default ({ children, width, ratio }: Props) => {
  const styles = {
    outer: css({
      position: "relative",
      width,
    }),
    after: css({
      paddingBottom: `${Math.floor(ratio * 100)}%`,
    }),
    inner: css({
      position: "absolute",
      width: "100%",
      height: "100%",
    }),
  };
  return (
    <div {...styles.outer}>
      <div {...styles.inner}>{children}</div>
      <div {...styles.after} />
    </div>
  );
};
