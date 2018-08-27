import * as React from "react";
import { css } from "glamor";
import { colors, sizes } from "../style";

type Props = React.InputHTMLAttributes<HTMLButtonElement>;

interface State {
  now: number;
  pressTime?: number;
  releaseTime?: number;
  lastPress?: { x: number; y: number };
  currentPress?: { x: number; y: number };
}

const OVERLAY_ANGLE_RAD = Math.PI / 8;
const OVERLAY_ENTER_TIME_MS = 200;
const OVERLAY_LEAVE_TIME_MS = 300;

// (Rotated) overlay just big enough to contain button
const overlayWidth =
  sizes.buttonWidthPx * Math.cos(OVERLAY_ANGLE_RAD) +
  sizes.inputHeightPx * Math.cos(Math.PI / 2 - OVERLAY_ANGLE_RAD);
const overlayHeight =
  sizes.buttonWidthPx * Math.cos(Math.PI / 2 - OVERLAY_ANGLE_RAD) +
  sizes.inputHeightPx * Math.cos(OVERLAY_ANGLE_RAD);

const styles = {
  button: css({
    position: "relative",
    display: "block",
    width: sizes.buttonWidthPx,
    height: sizes.inputHeightPx,
    overflow: "hidden",
    fontSize: sizes.uiFontSize,
    border: "none",
    backgroundColor: colors.primaryBackground,
    color: colors.primaryContent,
    touchAction: "none",

    ":focus": { outline: "none" },
  }),
  overlay: css({
    position: "absolute",
    top: (sizes.inputHeightPx - overlayHeight) / 2,
    left: (sizes.buttonWidthPx - overlayWidth) / 2,
    width: overlayWidth,
    height: overlayHeight,
    pointerEvents: "none",
    backgroundColor: colors.primaryDetail,
  }),
  content: css({
    transform: "translateZ(0px)", // force content above overlay
    pointerEvents: "none",
  }),
};

function cursorToOverlayOffsetX(cx: number, cy: number): number {
  // (cx, cy) - cursor postion relative to top left of button
  // (rx, ry) - width and height of button
  // (ox, oy) - vector with angle OVERLAY_ANGLE_RAD (top right to bottom left for small angles)
  // q = oy / ox

  // We intersect lines as follows:
  // cx + od * ox = rd * rx
  // cy + od * oy = rd * ry

  const rx = sizes.buttonWidthPx;
  const ry = sizes.inputHeightPx;
  const q = Math.tan(OVERLAY_ANGLE_RAD - Math.PI / 2);
  const rd = (cy - q * cx) / (ry - q * rx);

  return rd * overlayWidth;
}

type Action = (now: number, next: () => void) => void;

export default class Button extends React.Component<Props, State> {
  state: State = { now: 0 };
  actionQueue: Action[] = [];
  handlingActions = false;
  didUnmount = false;

  componentDidMount() {
    document.addEventListener("mouseup", this.onRelease);
    document.addEventListener("touchend", this.onRelease);
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.onRelease);
    document.removeEventListener("touchend", this.onRelease);
    this.didUnmount = true;
  }

  render() {
    const { lastPress, pressTime, releaseTime, now } = this.state;
    const tEnter = pressTime
      ? Math.max(0, Math.min(1, (now - pressTime) / OVERLAY_ENTER_TIME_MS))
      : 0;
    const tLeave = releaseTime
      ? Math.max(0, Math.min(1, (now - releaseTime) / OVERLAY_LEAVE_TIME_MS))
      : 0;
    const dx =
      pressTime && lastPress
        ? cursorToOverlayOffsetX(lastPress.x, lastPress.y)
        : 0;
    const overlayScale = tEnter;
    const overlayOpacity = Math.min(3 * tEnter, 1 - tLeave);
    const depression = Math.min(1, 10 * tEnter, 1 - tLeave);
    const shadowScale = 1 - 0.5 * depression;
    const shadowOpacity = (1 + depression) * sizes.shadow.opacity;
    const dynamic = {
      button: {
        transform: [
          `scale(${1 - 0.02 * depression})`,
          `translateY(${-0.25 * shadowScale * sizes.shadow.offsetYPx}px)`,
        ].join(" "),
        boxShadow: [
          shadowScale * sizes.shadow.offsetXPx + "px",
          shadowScale * sizes.shadow.offsetYPx + "px",
          shadowScale * sizes.shadow.blurPx + "px",
          `rgba(0, 0, 0, ${shadowOpacity})`,
        ].join(" "),
      },
      overlay: {
        opacity: overlayOpacity,
        transform: pressTime
          ? [
              `rotate(${OVERLAY_ANGLE_RAD}rad)`,
              `translateX(${-0.5 * overlayWidth + dx}px)`,
              `scaleX(${overlayScale})`,
              `translateX(${0.5 * overlayWidth - dx}px)`,
            ].join(" ")
          : undefined,
      },
    };
    return (
      <button
        tabIndex={-1}
        {...styles.button}
        {...this.props}
        onMouseDown={this.onMouseDown}
        onTouchStart={this.onTouchStart}
        onBlur={this.onRelease}
        style={dynamic.button}
      >
        <div {...styles.overlay} style={dynamic.overlay} />
        <div {...styles.content}>{this.props.children}</div>
      </button>
    );
  }

  onMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { currentPress } = this.state;
    if (!currentPress) {
      this.onPress(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    }
  };

  onTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    const { currentPress } = this.state;
    if (!currentPress) {
      const touch = e.targetTouches.item(0);
      const rect = e.currentTarget.getBoundingClientRect();
      this.onPress(touch.clientX - rect.left, touch.clientY - rect.top);
    }
  };

  onPress(x: number, y: number) {
    this.scheduleAction((now: number, next: () => void) => {
      this.setState(
        {
          currentPress: { x, y },
          lastPress: { x, y },
          now,
          pressTime: now,
          releaseTime: undefined,
        },
        next,
      );
      this.onFrame(now, next);
    });
  }

  onRelease = () => {
    this.scheduleAction((now: number, next: () => void) => {
      if (this.state.lastPress && !this.state.releaseTime) {
        this.setState({ currentPress: undefined, now, releaseTime: now }, next);
      } else {
        next();
      }
    });
  };

  // scheduleAction runs a function on the earliest possible animation frame.
  // ** Actions must always call "next" when they are done! **
  // Actions may call next multiple times (only the first call is considered).
  // All scheduled functions are run exactly once and in the order they were scheduled.
  scheduleAction(_action: Action) {
    this.actionQueue.push(_action);
    window.requestAnimationFrame((now: number) => {
      if (this.handlingActions) {
        return;
      }
      this.handlingActions = true;
      const handleNext = () => {
        const current = this.actionQueue.shift();
        if (!current) {
          this.handlingActions = false;
          return;
        }
        var nextCalled = false;
        current(now, () => {
          if (nextCalled) {
            return;
          }
          nextCalled = true;
          handleNext();
        });
      };
      handleNext();
    });
  }

  onFrame = (now: number, cb: () => void) => {
    if (this.didUnmount) {
      return;
    }
    if (
      this.state.lastPress &&
      this.state.now - (this.state.releaseTime || this.state.now) <=
        OVERLAY_LEAVE_TIME_MS
    ) {
      this.setState({ now }, cb);
      window.requestAnimationFrame(t =>
        this.onFrame(t, () => {
          /* intentionally empty */
        }),
      );
    } else {
      this.setState(
        {
          now,
          lastPress: undefined,
          pressTime: undefined,
          releaseTime: undefined,
        },
        cb,
      );
    }
  };
}
