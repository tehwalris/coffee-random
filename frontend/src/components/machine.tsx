import * as React from "react";
import MachinePure, {
  Heads,
  HeadProps,
  Props as PureProps,
} from "./machine-pure";
import { unreachable, easeInQuad } from "../util";
import { times } from "lodash";
import { createSpring } from "../spring";

interface Props {
  column: number; // integer [0, 3]
}

interface State {
  t: number;
  stageStartT: number;
  lastT: number;
  isMounted: boolean;
  stage: Stage;
  column: number; // integer [0, 3]
  position: number; // same as column, but float and wider range
  velocity: number;
  stillFrames: number; // number of consecutive frames where velocity === 0
  plan: PureProps;
}

enum Stage {
  MoveEnter,
  MoveLeave,
  PrePour,
  Pour,
  PostPour,
  Delay,
}

const SPRING = createSpring({
  stepMillis: 5,
  precision: 0.001,
  stiffness: 30,
  damping: 10,
});

// Switch stage from MoveEnter/MoveLeave when this is stillFrames >= SWITCH_STILL_FRAMES
const SWITCH_STILL_FRAMES = 3;

const DOOR_MS = 2000;
const COFFEE_DROP_MS = 80;
const OUTSIDE_POS = 0.2;
const BLINK_MS = 1000;
const POUR_MS = 7000;
const NEXT_POUR_DELAY = 2000;

const DEFAULT_HEAD: HeadProps = {
  door: 0,
  light: false,
};

const INITIAL_PLAN: PureProps = {
  arrowPos: OUTSIDE_POS,
  heads: times(4, () => DEFAULT_HEAD) as Heads,
  coffee: 0,
};

export default class Machine extends React.Component<Props, State> {
  state: State = {
    t: 0,
    stageStartT: 0,
    lastT: 0,
    isMounted: true,
    stage: Stage.MoveEnter,
    column: 1,
    position: INITIAL_PLAN.arrowPos,
    velocity: 0,
    stillFrames: 0,
    plan: INITIAL_PLAN,
  };

  componentDidMount() {
    requestAnimationFrame(this.onFrame);
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
  }

  render() {
    return <MachinePure {...this.state.plan} />;
  }

  private plan(): PureProps {
    const { t, stageStartT, lastT, stage } = this.state;
    const dt = t - lastT;
    const stageT = t - stageStartT;
    switch (stage) {
      case Stage.MoveEnter:
        return this.planMoveEnter(stageT, dt);
      case Stage.MoveLeave:
        return this.planMoveLeave(stageT, dt);
      case Stage.PrePour:
        return this.planPrePour(stageT);
      case Stage.Pour:
        return this.planPour(stageT);
      case Stage.PostPour:
        return this.planPostPour(stageT);
      case Stage.Delay:
        return this.planDelay(stageT);
      default:
        return unreachable(stage);
    }
  }

  private planMoveEnter(stageT: number, dt: number): PureProps {
    const { position, velocity, column, stillFrames } = this.state;
    this.setState(
      SPRING({
        position,
        velocity,
        dtMillis: dt,
        target: column,
      }),
    );
    if (stillFrames >= SWITCH_STILL_FRAMES) {
      this.switchStage(Stage.PrePour);
    }
    return {
      arrowPos: position,
      heads: times(4, () => DEFAULT_HEAD) as Heads,
      coffee: 0,
    };
  }

  private planMoveLeave(stageT: number, dt: number): PureProps {
    throw new Error("not implemented");
  }

  private planPrePour(stageT: number): PureProps {
    const { position, column } = this.state;
    const _coffee = (stageT - DOOR_MS) / COFFEE_DROP_MS;
    const coffee = easeInQuad(Math.max(0, Math.min(1, _coffee)));
    if (coffee >= 1) {
      this.switchStage(Stage.Pour);
    }
    const head: HeadProps = {
      door: Math.max(0, Math.min(1, stageT / DOOR_MS)),
      light: false,
    };
    return {
      arrowPos: position,
      heads: times(4, i => (i === column ? head : DEFAULT_HEAD)) as Heads,
      coffee: coffee / 2,
    };
  }

  private planPour(stageT: number): PureProps {
    const { position, column } = this.state;
    const head: HeadProps = {
      door: 1,
      light: stageT % (2 * BLINK_MS) < BLINK_MS,
    };
    if (stageT > POUR_MS) {
      this.switchStage(Stage.PostPour);
    }
    return {
      arrowPos: position,
      heads: times(4, i => (i === column ? head : DEFAULT_HEAD)) as Heads,
      coffee: 0.5,
    };
  }

  private planPostPour(stageT: number): PureProps {
    const { position, column } = this.state;
    const coffee = easeInQuad(
      Math.max(0, Math.min(1, stageT / COFFEE_DROP_MS)),
    );
    const _door = (stageT - COFFEE_DROP_MS) / DOOR_MS;
    const door = Math.max(0, Math.min(1, _door));
    if (door >= 1) {
      // TODO maybe abort
      this.switchStage(Stage.Delay);
    }
    const head: HeadProps = { door: 1 - door, light: false };
    return {
      arrowPos: position,
      heads: times(4, i => (i === column ? head : DEFAULT_HEAD)) as Heads,
      coffee: 0.5 + coffee / 2,
    };
  }

  private planDelay(stageT: number): PureProps {
    const { position } = this.state;
    if (stageT > NEXT_POUR_DELAY) {
      this.switchStage(Stage.PrePour);
    }
    return {
      arrowPos: position,
      heads: times(4, i => DEFAULT_HEAD) as Heads,
      coffee: 0,
    };
  }

  private switchStage(stage: Stage) {
    this.setState({ stage, stageStartT: this.state.t });
  }

  private onFrame = (nowMs: number) => {
    const { t, stageStartT, isMounted, stillFrames, velocity } = this.state;
    if (isMounted) {
      requestAnimationFrame(this.onFrame);
    }
    if (!stageStartT) {
      this.setState({ stageStartT: t });
    }
    this.setState({
      t: nowMs,
      lastT: t,
      plan: this.plan(),
      stillFrames: velocity ? 0 : stillFrames + 1,
    });
  };
}
