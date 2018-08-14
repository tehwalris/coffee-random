import * as React from "react";

// The Placed component wraps a react child and a placement function.
// It is used to pass contents to PlacementParent.
// A "page" component (eg. rating page) can render PlacedChild<T>[] as the children of PlacementParent.
// This way the individual pieces can be placed in different parts of the DOM tree, but share
// state from the page component, since they are rendered together and later split.

interface Props<T> {
  child: React.ReactChild;
  place: (inputs: T) => Placement;
}

export interface Placement {
  x: number;
  y: number;
  opacity: number;
}

export default function Placed<T>(props: Props<T>) {
  return undefined;
}

export type PlacedChild<T> = React.ReactElement<Props<T>>;
