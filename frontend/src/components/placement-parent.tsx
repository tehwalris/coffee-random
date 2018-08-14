import * as React from "react";
import { PlacedChild } from "./placed";

export interface Placement {
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
}

interface Props<I, D extends I> {
  inputs: I;
  derive: (inputs: I) => D;
  children: PlacedChild<D>[];
  getWrapperSize: (inputs: D) => { width: number; height: number };
}

export default class PlacementParent<I, D extends I> extends React.Component<
  Props<I, D>
> {
  render() {
    const { inputs, derive, children, getWrapperSize } = this.props;
    const derived = derive(inputs);
    return (
      <div style={getWrapperSize(derived)}>
        {children.map(({ props: { child, place } }) => (
          <div style={this.placementToStyle(place(derived))}>{child}</div>
        ))}
      </div>
    );
  }

  private placementToStyle({ x, y, ...rest }: Placement): React.CSSProperties {
    return {
      ...rest,
      transform: `translate(${x}px, ${y}px)`,
    };
  }
}
