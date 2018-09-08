import * as React from "react";
import { BaseProps as PlacedProps } from "./placed";
import { ANIMATION_SLOWDOWN } from "../util";

// PlacementParent works together with Placed as a convenient
// system for dynamically positioning multiple elements.
// PlacementParent normally has Placed components as children.
// PlacementParent renders each child with the correct transform.

const DPR = window.devicePixelRatio;

// DEVICE_ROUND_FACTOR adjusts rounding of positions
// 1 means round to whole screen pixels (sharp)
// 10 means round to 10 screen pixels (very coarse)
// 0.5 means round to half a screen pixel (may blur)
const ROUND_FACTOR = Math.min(1, 1 / ANIMATION_SLOWDOWN);

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

interface Props<I> {
  inputs: I;
  children: Placeable<I> | Placeable<I>[];
  getWrapperSize: (derived: I) => { width: number; height: number };
}

export default class PlacementParent<I> extends React.Component<Props<I>> {
  render() {
    const { inputs, children, getWrapperSize } = this.props;
    return (
      <div style={{ ...getWrapperSize(inputs), position: "relative" }}>
        {React.Children.toArray(children).map((c: Placeable<I>) =>
          React.cloneElement(c, { render: this.renderPlaced }),
        )}
      </div>
    );
  }

  renderPlaced = ({ children: c, place }: PlacedProps<I>): React.ReactChild => {
    return (
      <div style={this.placementToStyle(place(this.props.inputs))}>{c}</div>
    );
  };

  // round takes a value in CSS pixels a rounds it.
  // The rounded value is a multiple of ROUND_FACTOR/DPR, so
  // that when it is used for transforms, the transform
  // is aligned to real device pixels.
  private round(v: number): number {
    const c = ROUND_FACTOR / DPR;
    return Math.round(v / c) * c;
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
