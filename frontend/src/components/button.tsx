import * as React from "react";
import { css } from "glamor";
import { colors, sizes } from "../style";

type Props = React.InputHTMLAttributes<HTMLButtonElement>;

interface State {
  press?: { x: number; y: number };
}

const OVERLAY_ANGLE_RAD = Math.PI / 8;

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
    boxShadow: [
      sizes.shadow.offsetXPx + "px",
      sizes.shadow.offsetYPx + "px",
      sizes.shadow.blurPx + "px",
      `rgba(0, 0, 0, ${sizes.shadow.opacity})`,
    ].join(" "),

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

export default class Button extends React.Component<Props, State> {
  state: State = {};

  componentDidMount() {
    document.addEventListener("mouseup", this.onRelease);
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.onRelease);
  }

  render() {
    const { press } = this.state;
    const t = 0.2;
    const overlayDynamic: React.CSSProperties = {
      opacity: press ? 1 : 0,
      transform: press
        ? [
            `rotate(${OVERLAY_ANGLE_RAD}rad)`,
            `translateX(${-0.5 * overlayWidth +
              cursorToOverlayOffsetX(press.x, press.y)}px)`,
            `scaleX(${t})`,
          ].join(" ")
        : undefined,
    };
    return (
      <button
        {...styles.button}
        {...this.props}
        onMouseDown={this.onMouseDown}
        onBlur={this.onRelease}
      >
        <div {...styles.overlay} style={overlayDynamic} />
        <div {...styles.content}>{this.props.children}</div>
      </button>
    );
  }

  onMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!this.state.press) {
      this.setState({
        press: { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY },
      });
    }
  };

  onRelease = () => {
    this.setState({ press: undefined });
  };
}
