import * as React from "react";
import SaveTickPure from "./save-tick-pure";
import { easeInQuad } from "../util";

interface Props {
  tick: boolean;
  size: string;
}

interface State {
  tick: boolean;
  t: number;
  lastMs: number;
  isMounted: boolean;
  firstSpin: boolean;
}

const SPIN_TIME_MS = 500;

export default class SaveTick extends React.Component<Props, State> {
  state: State = {
    tick: false,
    t: -0.75,
    lastMs: 0,
    isMounted: true,
    firstSpin: true,
  };

  componentDidMount() {
    requestAnimationFrame(this.onFrame);
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
  }

  private onFrame = (nowMs: number) => {
    const { lastMs, t, isMounted } = this.state;
    let { tick } = this.state;
    if (tick && t > 1) {
      return;
    }
    if (isMounted) {
      requestAnimationFrame(this.onFrame);
    }
    if (lastMs) {
      let nextT = t + (nowMs - lastMs) / SPIN_TIME_MS;
      if (nextT >= 0) {
        this.setState({ firstSpin: false });
      }
      if (!tick && nextT > 1) {
        nextT = nextT % 1;
        tick = this.props.tick;
      }
      this.setState({ lastMs: nowMs, t: nextT, tick });
    } else {
      this.setState({ lastMs: nowMs });
      return;
    }
  };

  render() {
    const { size } = this.props;
    const { tick, t, firstSpin } = this.state;
    return (
      <div>
        <SaveTickPure
          tick={tick}
          t={firstSpin ? easeInQuad(t) : t}
          size={size}
        />
      </div>
    );
  }
}
