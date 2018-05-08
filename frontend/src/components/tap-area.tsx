import * as React from "react";
import { css } from "glamor";

export interface Coordinate {
  x: number; // [0, 1] (left - right)
  y: number; // [0, 1] (top - bottom)
}

interface Props {
  onTap: (coord: Coordinate) => void;
  children?: React.ReactChild | React.ReactChild[];
}

const styles = {
  outer: css({
    border: "1px solid black",
    width: "100%",
    height: "100%",
  }),
  inner: css({
    pointerEvents: "none",
    userSelect: "none",
  }),
};

export default class TapArea extends React.Component<Props> {
  render() {
    const { children } = this.props;
    return (
      <div {...styles.outer} onClick={this.onClick}>
        <div {...styles.inner}>{children}</div>
      </div>
    );
  }

  onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    this.props.onTap({
      x: e.nativeEvent.offsetX / e.currentTarget.offsetHeight,
      y: e.nativeEvent.offsetY / e.currentTarget.offsetWidth,
    });
  };
}
