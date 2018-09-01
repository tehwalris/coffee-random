import * as React from "react";
import { BaseProps as PlacedProps } from "./placed";

const DPR = window.devicePixelRatio;

export interface Placement {
  x: number;
  y: number;
  w: number;
  h: number;
  style?: React.CSSProperties;
}

export type PlaceableProps<D> = {
  render?: (props: PlacedProps<D>) => React.ReactChild;
};

type Placeable<D> = React.ReactElement<PlaceableProps<D>>;

interface Props<I, D extends I> {
  inputs: I;
  derive: (inputs: I) => D;
  children: Placeable<D> | Placeable<D>[];
  getWrapperSize: (derived: D) => { width: number; height: number };
}

export default class PlacementParent<I, D extends I> extends React.Component<
  Props<I, D>
> {
  lastInputs: I | undefined;
  lastDerived: D | undefined;

  getDerived = (): D => {
    const { inputs, derive } = this.props;
    if (inputs === this.lastInputs) {
      return this.lastDerived!;
    }
    this.lastInputs = inputs;
    this.lastDerived = derive(inputs);
    return this.lastDerived;
  };

  render() {
    const { inputs, derive, children, getWrapperSize } = this.props;
    const derived = derive(inputs);
    return (
      <div style={{ ...getWrapperSize(derived), position: "relative" }}>
        {React.Children.toArray(children).map((c: Placeable<D>) =>
          React.cloneElement(c, { render: this.renderPlaced }),
        )}
      </div>
    );
  }

  renderPlaced = ({ children: c, place }: PlacedProps<D>): React.ReactChild => {
    return (
      <div style={this.placementToStyle(place(this.getDerived()))}>{c}</div>
    );
  };

  // round takes a value in CSS pixels a rounds it.
  // The rounded value is a multiple of 1/DPR, so
  // that when it is used for transforms, the transform
  // is aligned to real device pixels.
  private round(v: number): number {
    return Math.round(v * DPR) / DPR;
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
      transform: `translate(${this.round(x)}px, ${this.round(y)}px)`,
      width: this.round(w),
      height: this.round(h),
      willChange: "transform opacity",
      contain: "size layout style",
      ...style,
    };
  }
}
