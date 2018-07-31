// Based on https://spin.atomicobject.com/2015/07/14/css-responsive-square/

import * as React from "react";

interface Props {
  children?: React.ReactChild | React.ReactChild[];
  width: string;
  ratio: number; // height / width
}

export default ({ children, width, ratio }: Props) => {
  // Not using glamor here, since these styles mostly depend on props.
  const styles: { [key: string]: React.CSSProperties } = {
    outer: {
      position: "relative",
      width,
    },
    after: {
      paddingBottom: `${Math.floor(ratio * 100)}%`,
    },
    inner: {
      position: "absolute",
      width: "100%",
      height: "100%",
    },
  };
  return (
    <div style={styles.outer}>
      <div style={styles.inner}>{children}</div>
      <div style={styles.after} />
    </div>
  );
};
