import * as React from "react";
import { css } from "glamor";
import { ANIMATION_SLOWDOWN } from "../util";

const SIZE_PX = 25;
const FADE_TIME_MS = 300 * Math.sqrt(ANIMATION_SLOWDOWN);

const styles = {
  wrapper: css({
    position: "fixed",
    top: 0,
    left: 0,
    pointerEvents: "none",
  }),
  cursor: css({
    width: SIZE_PX,
    height: SIZE_PX,
    marginLeft: -SIZE_PX / 2,
    marginTop: -SIZE_PX / 2,
    willChange: "transform, opacity",
    borderRadius: "50%",
    border: "1px solid white",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  }),
};

export default class FakeTouchCursor extends React.PureComponent<{}> {
  position = { x: -1000, y: -1000 };
  isMouseDown = false;
  fading = false;
  cursorRef = React.createRef<HTMLDivElement>();
  fadeTimeoutHandle: NodeJS.Timer | undefined = undefined;

  componentWillMount() {
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mousedown", this.onMouseDown);
    document.addEventListener("mouseup", this.onMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mousedown", this.onMouseDown);
    document.removeEventListener("mouseup", this.onMouseUp);
  }

  render() {
    return (
      <div {...styles.wrapper}>
        <div
          {...styles.cursor}
          style={this.getDynamicStyles()}
          ref={this.cursorRef}
        />
      </div>
    );
  }

  getDynamicStyles() {
    const { x, y } = this.position;
    return {
      transform: `translate(${x}px, ${y}px)`,
      opacity: this.isMouseDown ? 1 : 0,
      transition: this.fading
        ? `opacity ${FADE_TIME_MS}ms ease 20ms`
        : undefined,
    };
  }

  applyDynamicStyles() {
    const el = this.cursorRef.current;
    if (!el) {
      return;
    }

    const s = this.getDynamicStyles();
    Object.keys(s).forEach(k => {
      if (s[k] === undefined) {
        el.style.removeProperty(k);
      } else {
        el.style[k] = s[k].toString();
      }
    });

    this.startFade();
  }

  startFade() {
    this.stopFade();
    this.fading = true;
    this.fadeTimeoutHandle = setTimeout(this.onFadeTimeout, FADE_TIME_MS);
  }

  stopFade() {
    this.fading = false;
    if (this.fadeTimeoutHandle) {
      clearTimeout(this.fadeTimeoutHandle);
    }
  }

  onMouseMove = (e: MouseEvent) => {
    this.position = { x: e.clientX, y: e.clientY };
    this.applyDynamicStyles();
  };

  onMouseDown = (e: MouseEvent) => {
    this.isMouseDown = true;
    this.stopFade();
    this.applyDynamicStyles();
  };

  onMouseUp = (e: MouseEvent) => {
    this.isMouseDown = false;
    this.applyDynamicStyles();
  };

  onFadeTimeout = () => {
    this.fading = false;
  };
}
