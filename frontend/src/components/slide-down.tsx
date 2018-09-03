import * as React from "react";
import { css } from "glamor";
import { TransitionGroup, CSSTransition } from "react-transition-group";

const SLIDE_DURATION_MS = 500;

interface Props {
  top?: React.ReactChild;
  bottom?: React.ReactChild;
  focusBottom?: boolean;
  noAnimate: boolean;
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

    ".slide-enter": {
      willChange: "transform",
      transform: "translateY(100%)",
    },
    ".slide-enter-active": {
      willChange: "transform",
      transform: "translateY(0)",
      transition: `transform ${SLIDE_DURATION_MS}ms ease-in-out`,
    },
    ".slide-exit": {
      willChange: "transform",
      transform: "translateY(0)",
    },
    ".slide-exit-active": {
      willChange: "transform",
      transform: "translateY(-100%)",
      transition: `transform ${SLIDE_DURATION_MS}ms ease-in-out`,
    },
  }),
};

export default class SlideDown extends React.Component<Props> {
  render() {
    const { top, bottom, focusBottom, noAnimate } = this.props;
    return (
      <div {...styles.outerWrapper}>
        <TransitionGroup>
          {[
            <CSSTransition
              key={focusBottom ? "bottom" : "top"}
              classNames="slide"
              timeout={noAnimate ? 0 : SLIDE_DURATION_MS}
            >
              <div {...styles.innerWrapper}>{focusBottom ? bottom : top}</div>
            </CSSTransition>,
          ]}
        </TransitionGroup>
      </div>
    );
  }
}
