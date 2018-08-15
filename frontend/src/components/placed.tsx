import * as React from "react";
import { Placement } from "./placement-parent";

// The Placed component wraps a react child and a placement function.
// It is used to pass contents to PlacementParent.
// A "page" component (eg. rating page) can render PlacedChild<T>[] as the children of PlacementParent.
// This way the individual pieces can be placed in different parts of the DOM tree, but share
// state from the page component, since they are rendered together and later split.

interface Props<T> {
  children?: React.ReactChild;
  place: (inputs: T) => Placement;
}

export default function Placed<T>(props: Props<T>) {
  return null;
}

export type PlacedChild<T> = React.ReactElement<Props<T>>;
