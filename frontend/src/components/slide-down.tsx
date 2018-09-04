import * as React from "react";
import { css } from "glamor";
import * as ReactSpring from "react-spring";
import { springConfigLoginSlide } from "../style";

// const SLIDE_DURATION_MS = 500;

interface Props {
  top?: React.ReactChild;
  bottom?: React.ReactChild;
  focusBottom?: boolean;
  noAnimate: boolean; // TODO use
}

const styles = {
  outerWrapper: css({
    position: "relative",
    height: "100%",
  }),
  innerWrapper: css({
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    willChange: "transform",
  }),
  animateFrom: {
    transform: "translateY(100%)",
  },
  animateEnter: {
    transform: "translateY(0)",
  },
  animateLeave: {
    transform: "translateY(-100%)",
  },
};

// tslint:disable-next-line:no-any
const Transition = (ReactSpring as any).Transition;

export default class SlideDown extends React.Component<Props> {
  render() {
    const { top, bottom, focusBottom, noAnimate } = this.props;
    return (
      <div {...styles.outerWrapper}>
        <Transition
          keys={focusBottom ? "bottom" : "top"}
          from={styles.animateFrom}
          enter={styles.animateEnter}
          leave={styles.animateLeave}
          immediate={!focusBottom || noAnimate}
          config={springConfigLoginSlide}
        >
          {(s: React.CSSProperties) => (
            <div {...styles.innerWrapper} style={s}>
              {focusBottom ? bottom : top}
            </div>
          )}
        </Transition>
      </div>
    );
  }
}
