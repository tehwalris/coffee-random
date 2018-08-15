import * as React from "react";
import { PlacedChild } from "./placed";

export interface Placement {
  x: number;
  y: number;
  w: number;
  h: number;
  style?: React.CSSProperties;
}

interface Props<I, D extends I> {
  inputs: I;
  derive: (inputs: I) => D;
  children: PlacedChild<D>[];
  getWrapperSize: (derived: D) => { width: number; height: number };
}

export default class PlacementParent<I, D extends I> extends React.Component<
  Props<I, D>
> {
  render() {
    const { inputs, derive, children, getWrapperSize } = this.props;
    const derived = derive(inputs);
    return (
      <div style={{ ...getWrapperSize(derived), position: "relative" }}>
        {children.map(({ props: { children: c, place }, key }, i) => (
          <div key={key || i} style={this.placementToStyle(place(derived))}>
            {c}
          </div>
        ))}
      </div>
    );
  }

  private placementToStyle({
    x,
    y,
    w,
    h,
    style = {},
  }: Placement): React.CSSProperties {
    return {
      position: "absolute",
      top: 0,
      left: 0,
      transform: `translate(${x}px, ${y}px)`,
      width: w,
      height: h,
      ...style,
    };
  }
}
