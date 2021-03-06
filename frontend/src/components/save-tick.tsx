import * as React from "react";
import SaveTickPure from "./save-tick-pure";
import { easeInQuad, ANIMATION_SLOWDOWN } from "../util";
import { RatingState } from "../store";

// SaveTick animates SaveTickPure.
// It ensures that morphing between the different contents
// of SaveTickPure only occurs after a full turn.

interface Props {
  ratingState: RatingState;
  size: string;
}

interface State {
  ratingState: RatingState;
  t: number;
  lastMs: number;
  firstSpin: boolean;
}

const SPIN_TIME_MS = 500 * ANIMATION_SLOWDOWN;

export default class SaveTick extends React.Component<Props, State> {
  state: State = {
    ratingState: RatingState.Saving,
    t: -0.75,
    lastMs: 0,
    firstSpin: true,
  };
  ownIsMounted = true;

  componentDidMount() {
    requestAnimationFrame(this.onFrame);
  }

  componentWillUnmount() {
    this.ownIsMounted = false;
  }

  private onFrame = (nowMs: number) => {
    const { lastMs, t } = this.state;
    let { ratingState } = this.state;
    if ((ratingState !== RatingState.Saving && t > 1) || !this.ownIsMounted) {
      return;
    }
    requestAnimationFrame(this.onFrame);
    if (lastMs) {
      let nextT = t + (nowMs - lastMs) / SPIN_TIME_MS;
      if (nextT >= 0) {
        this.setState({ firstSpin: false });
      }
      if (ratingState === RatingState.Saving && nextT > 1) {
        nextT = nextT % 1;
        ratingState = this.props.ratingState;
      }
      this.setState({ lastMs: nowMs, t: nextT, ratingState });
    } else {
      this.setState({ lastMs: nowMs });
      return;
    }
  };

  render() {
    const { size } = this.props;
    const { ratingState, t, firstSpin } = this.state;
    return (
      <div>
        <SaveTickPure
          ratingState={ratingState}
          t={firstSpin ? easeInQuad(t) : t}
          size={size}
        />
      </div>
    );
  }
}
