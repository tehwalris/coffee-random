import * as React from "react";
import MachinePure, {
  Heads,
  HeadProps,
  Props as PureProps,
} from "./machine-pure";
import { unreachable, easeInQuad } from "../util";
import { times } from "lodash";
import { createSpring } from "../spring";
import { COLUMN_COUNT } from "../store";

interface Props {
  column?: number; // integer [1, 4]
}

interface State {
  t: number;
  stageStartT: number;
  lastT: number;
  isMounted: boolean;
  stage: Stage;

  // HACK fake "column 0" (outside of machine) when no column supplied
  column: number; // integer [1, 4] or 0

  position: number; // same as column, but float and wider range
  velocity: number;
  stillFrames: number; // number of consecutive frames where velocity === 0
  plan: PureProps;
  abort: boolean; // true when column should switch
  blonding: number; // preserve blonding across stages on early aborts
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
  precision: 0.005,
  stiffness: 45,
  damping: 12,
});

// Switch stage from MoveEnter/MoveLeave when this is stillFrames >= SWITCH_STILL_FRAMES
const SWITCH_STILL_FRAMES = 2;

const DOOR_MS = 2000;
const COFFEE_DROP_MS = 80;
const OUTSIDE_POS = 1;
const BLINK_MS = 1000;
const POUR_MS = 7000;
const MIN_POUR_MS = 500;
const NEXT_POUR_DELAY = 2000;

const DEFAULT_HEAD: HeadProps = {
  door: 0,
  light: false,
};

const INITIAL_PLAN: PureProps = {
  arrowPos: 0,
  heads: times(4, () => DEFAULT_HEAD) as Heads,
  coffee: 0,
  blonding: 0,
};

export default class Machine extends React.Component<Props, State> {
  state: State = {
    t: 0,
    stageStartT: 0,
    lastT: 0,
    isMounted: true,
    stage: Stage.MoveEnter,
    column: 0,
    position: INITIAL_PLAN.arrowPos,
    velocity: 0,
    stillFrames: 0,
    plan: INITIAL_PLAN,
    abort: false,
    blonding: 0,
  };

  componentWillMount() {
    const column = this.props.column || 0; // see comment on State["column"]
    this.setState({ column, position: getOutsidePos(column) });
  }

  componentDidMount() {
    requestAnimationFrame(this.onFrame);
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.column !== nextProps.column) {
      this.setState({ abort: true });
    }
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
    const { position, velocity, column, stillFrames, abort } = this.state;
    this.setState(
      SPRING({
        position,
        velocity,
        dtMillis: dt,
        target: column,
      }),
    );
    if (abort) {
      this.switchStage(Stage.MoveLeave);
    } else if (
      stillFrames >= SWITCH_STILL_FRAMES &&
      Math.abs(position - column) < 0.1
    ) {
      this.switchStage(Stage.PrePour);
    }
    return {
      arrowPos: position,
      heads: times(4, () => DEFAULT_HEAD) as Heads,
      coffee: 0,
      blonding: 0,
    };
  }

  private planMoveLeave(stageT: number, dt: number): PureProps {
    const { position } = this.state;
    const reachedOuter =
      Math.abs(position - getOutsidePos(this.state.column)) < 0.1;
    const newColumn = this.props.column || 0; // see comment on State["column"]
    const sameSide =
      getOutsidePos(this.state.column) === getOutsidePos(newColumn);
    if (
      sameSide ||
      (this.state.stillFrames >= SWITCH_STILL_FRAMES && reachedOuter)
    ) {
      this.setState({
        abort: false,
        column: newColumn,
        position: sameSide ? position : getOutsidePos(newColumn),
      });
      this.switchStage(Stage.MoveEnter);
    } else {
      const { velocity, column } = this.state;
      this.setState(
        SPRING({
          position,
          velocity,
          dtMillis: dt,
          target: getOutsidePos(column),
        }),
      );
    }
    if (
      this.state.stillFrames >= SWITCH_STILL_FRAMES &&
      Math.abs(newColumn - this.state.column) < 0.1
    ) {
      this.setState({ column: newColumn });
      this.switchStage(Stage.MoveEnter);
    }
    return {
      arrowPos: this.state.position,
      heads: times(4, () => DEFAULT_HEAD) as Heads,
      coffee: 0,
      blonding: 0,
    };
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
      heads: times(4, i => (i + 1 === column ? head : DEFAULT_HEAD)) as Heads,
      coffee: coffee / 2,
      blonding: 0,
    };
  }

  private planPour(stageT: number): PureProps {
    const { position, column, abort } = this.state;
    const head: HeadProps = {
      door: 1,
      light: stageT % (2 * BLINK_MS) < BLINK_MS,
    };
    if ((abort && stageT > MIN_POUR_MS) || stageT > POUR_MS) {
      this.switchStage(Stage.PostPour);
    }
    const blonding = Math.max(0, Math.min(1, stageT / POUR_MS));
    this.setState({ blonding });
    return {
      arrowPos: position,
      heads: times(4, i => (i + 1 === column ? head : DEFAULT_HEAD)) as Heads,
      coffee: 0.5,
      blonding,
    };
  }

  private planPostPour(stageT: number): PureProps {
    const { position, column, blonding, abort } = this.state;
    const coffee = easeInQuad(
      Math.max(0, Math.min(1, stageT / COFFEE_DROP_MS)),
    );
    const _door = (stageT - COFFEE_DROP_MS) / DOOR_MS;
    const door = Math.max(0, Math.min(1, _door));
    if (door >= 1) {
      this.switchStage(abort ? Stage.MoveLeave : Stage.Delay);
    }
    const head: HeadProps = { door: 1 - door, light: false };
    return {
      arrowPos: position,
      heads: times(4, i => (i + 1 === column ? head : DEFAULT_HEAD)) as Heads,
      coffee: 0.5 + coffee / 2,
      blonding,
    };
  }

  private planDelay(stageT: number): PureProps {
    const { position, abort } = this.state;
    if (abort) {
      this.switchStage(Stage.MoveLeave);
    } else if (stageT > NEXT_POUR_DELAY) {
      this.switchStage(Stage.PrePour);
    }
    return {
      arrowPos: position,
      heads: times(4, i => DEFAULT_HEAD) as Heads,
      coffee: 0,
      blonding: 0,
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

function getOutsidePos(column: number) {
  return column <= Math.floor(COLUMN_COUNT / 2)
    ? 1 - OUTSIDE_POS
    : COLUMN_COUNT + OUTSIDE_POS;
}
