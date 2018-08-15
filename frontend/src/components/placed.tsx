import * as React from "react";
import { Placement, PlaceableProps } from "./placement-parent";

// The Placed component wraps a react child and a placement function.
// It is used to pass contents to PlacementParent.
// A "page" component (eg. rating page) can render PlacedChild<T>[] as the children of PlacementParent.
// This way the individual pieces can be placed in different parts of the DOM tree, but share
// state from the page component, since they are rendered together and later split.

export interface BaseProps<T> {
  children?: React.ReactChild;
  place: (inputs: T) => Placement;
}

type Props<T> = BaseProps<T> & PlaceableProps<T>;

export default class Placed<T> extends React.Component<Props<T>> {
  render() {
    const { render, place, children } = this.props;
    return render ? render({ place, children }) : undefined;
  }
}
