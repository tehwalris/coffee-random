import * as React from "react";
import SaveTickPure from "./save-tick-pure";

interface Props {
  tick: boolean;
}

interface State {
  tick: boolean;
  t: number;
  lastMs: number;
  isMounted: boolean;
}

const SPIN_TIME_MS = 1500;

export default class SaveTick extends React.Component<Props, State> {
  state: State = {
    tick: false,
    t: 0,
    lastMs: 0,
    isMounted: true,
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
    const { tick, t } = this.state;
    return (
      <div>
        <SaveTickPure tick={tick} t={t} />
      </div>
    );
  }
}
