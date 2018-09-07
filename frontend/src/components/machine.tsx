import * as React from "react";
import MachinePure, { Heads, HeadProps } from "./machine-pure";
import { unreachable, easeInQuad, ANIMATION_SLOWDOWN } from "../util";
import { times } from "lodash";
import { createSpring } from "../spring";
import { COLUMN_COUNT } from "../store";
import { PlaceableProps } from "./placement-parent";
import { Derived } from "./composite-page";
import { springConfigCup } from "../style";

interface Props extends PlaceableProps<Derived> {
  column?: number; // integer [1, 4]
  stopPour: boolean;
  stopEverything: boolean;
}

interface Plan {
  arrowPos: number;
  heads: Heads;
  coffee: number;
  blonding: number;
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
  plan: Plan;
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
  stiffness: springConfigCup.tension,
  damping: springConfigCup.friction,
});

// Switch stage from MoveEnter/MoveLeave when this is stillFrames >= SWITCH_STILL_FRAMES
const SWITCH_STILL_FRAMES = Math.round(2 * ANIMATION_SLOWDOWN);

const DOOR_MS_PRE = 2000 * ANIMATION_SLOWDOWN;
const DOOR_MS_POST = 1000 * ANIMATION_SLOWDOWN;
const COFFEE_DROP_MS = 150 * ANIMATION_SLOWDOWN;
const OUTSIDE_POS = 1;
const BLINK_MS = 1000 * ANIMATION_SLOWDOWN;
const POUR_MS = 7000 * ANIMATION_SLOWDOWN;
const MIN_POUR_MS = 500 * ANIMATION_SLOWDOWN;
const NEXT_POUR_DELAY = 2000 * ANIMATION_SLOWDOWN;
const POST_POUR_EXTRA_DELAY_MS = 200 * ANIMATION_SLOWDOWN;

const DEFAULT_HEAD: HeadProps = {
  door: 0,
  light: false,
};

const freshState = (_column: number | undefined): State => {
  const column = _column || 0; // see comment on State["column"]
  return {
    t: 0,
    stageStartT: 0,
    lastT: 0,
    isMounted: true,
    stage: Stage.MoveEnter,
    column: column || 0,
    position: getOutsidePos(column),
    velocity: 0,
    stillFrames: 0,
    plan: {
      arrowPos: 0,
      heads: times(4, () => DEFAULT_HEAD) as Heads,
      coffee: 0,
      blonding: 0,
    },
    abort: false,
    blonding: 0,
  };
};

export default class Machine extends React.Component<Props, State> {
  state: State;

  componentWillMount() {
    this.setState(freshState(this.props.column));
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

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (nextProps.stopEverything) {
      return false;
    }
    return nextProps.column !== this.props.column || nextState !== this.state;
  }

  render() {
    return (
      <MachinePure
        {...this.state.plan}
        render={this.props.render}
        freezeSlowAnimations={this.props.stopPour}
      />
    );
  }

  private plan(): Plan {
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

  private planHeads(
    activeColumn: number | undefined,
    light: boolean = false,
  ): Heads {
    const dt = this.state.t - this.state.lastT;
    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    console.log(this.state.plan.heads);
    return this.state.plan.heads.map((h, i) => {
      const active = i + 1 === activeColumn;
      return {
        door: clamp(h.door + dt / (active ? DOOR_MS_PRE : -DOOR_MS_POST)),
        light: active ? light : false,
      };
    }) as Heads;
  }

  private planMoveEnter(stageT: number, dt: number): Plan {
    const { position, velocity, column, stillFrames, abort } = this.state;
    if (!abort && this.props.column === undefined) {
      // Don't plan anything until we know where the cup should be.
      return this.state.plan;
    }
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
      heads: this.planHeads(undefined),
      coffee: 0,
      blonding: 0,
    };
  }

  private planMoveLeave(stageT: number, dt: number): Plan {
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
      heads: this.planHeads(undefined),
      coffee: 0,
      blonding: 0,
    };
  }

  private planPrePour(stageT: number): Plan {
    const { position, column, abort } = this.state;
    const _coffee = (stageT - DOOR_MS_PRE) / COFFEE_DROP_MS;
    const coffee = easeInQuad(Math.max(0, Math.min(1, _coffee)));
    if (abort && coffee === 0) {
      this.switchStage(Stage.MoveLeave);
    }
    if (coffee >= 1) {
      this.switchStage(Stage.Pour);
    }
    return {
      arrowPos: position,
      heads: this.planHeads(column, false),
      coffee: coffee / 2,
      blonding: 0,
    };
  }

  private planPour(stageT: number): Plan {
    const { position, column, abort } = this.state;
    if (
      this.props.stopPour ||
      (abort && stageT > MIN_POUR_MS) ||
      stageT > POUR_MS
    ) {
      this.switchStage(Stage.PostPour);
    }
    const light = stageT % (2 * BLINK_MS) < BLINK_MS;
    const blonding = Math.max(0, Math.min(1, stageT / POUR_MS));
    this.setState({ blonding });
    return {
      arrowPos: position,
      heads: this.planHeads(column, light),
      coffee: 0.5,
      blonding,
    };
  }

  private planPostPour(stageT: number): Plan {
    const { stopPour } = this.props;
    const { position, blonding, abort, column } = this.state;
    const coffee = easeInQuad(
      Math.max(0, Math.min(1, stageT / COFFEE_DROP_MS)),
    );
    if (!stopPour && stageT >= COFFEE_DROP_MS + POST_POUR_EXTRA_DELAY_MS) {
      this.switchStage(abort ? Stage.MoveLeave : Stage.Delay);
    }
    return {
      arrowPos: position,
      heads: this.planHeads(stopPour ? column : undefined, false),
      coffee: 0.5 + coffee / 2,
      blonding,
    };
  }

  private planDelay(stageT: number): Plan {
    const { position, abort } = this.state;
    if (abort) {
      this.switchStage(Stage.MoveLeave);
    } else if (stageT > NEXT_POUR_DELAY) {
      this.switchStage(Stage.PrePour);
    }
    return {
      arrowPos: position,
      heads: this.planHeads(undefined),
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
