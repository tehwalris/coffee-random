import * as React from "react";
import { Placement, PlaceableProps } from "./placement-parent";

// The Placed component wraps a react child and a placement function.
// It is used to pass contents to PlacementParent.
// A "page" component (eg. rating page) can render PlacedChild<T>[] as the children of PlacementParent.
// This way the individual pieces can be placed in different parts of the DOM tree, but share
// state from the page component, since they are rendered together and later split.

interface ContentProps {
  children?: React.ReactChild | React.ReactChild[];

  // updateFrom determines when the content of Placed is re-rendered.
  // The style of the placed wrapper (defined by Placement) is always updated.
  // If updateFrom is not passed, the content is always re-rendered.
  // If updateFrom is passed, the content is re-rendered if two consecutive
  // return values of updateFrom are not reference equal.
  updateFrom?: () => {};
}

class PlacedContent extends React.Component<ContentProps> {
  oldKey = {}; // nothing will be equal to this

  shouldComponentUpdate(nextProps: ContentProps) {
    const newKey = nextProps.updateFrom ? nextProps.updateFrom() : {};
    const same = newKey === this.oldKey;
    this.oldKey = newKey;
    return !same;
  }

  render() {
    return this.props.children || [];
  }
}

export interface BaseProps<T> extends ContentProps {
  place: (inputs: T) => Placement;
}

type Props<T> = BaseProps<T> & PlaceableProps<T>;

export default class Placed<T> extends React.Component<Props<T>> {
  render() {
    const { render, place, children, updateFrom } = this.props;
    const content = (
      <PlacedContent updateFrom={updateFrom}>{children}</PlacedContent>
    );
    return render ? render({ place, children: content }) : undefined;
  }
}
