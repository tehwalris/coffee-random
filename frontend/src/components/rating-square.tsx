import * as React from "react";
import { RatingStore, RatingState, Rating } from "../store";
import TapArea from "./tap-area";
import { css } from "glamor";
import { sizes, colors } from "../style";
import SaveTick from "./save-tick";
import posed, { PoseGroup } from "react-pose";
import Placed from "./placed";
import { Derived } from "./composite-page";
import { PlaceableProps } from "./placement-parent";

interface Props extends PlaceableProps<Derived> {
  store?: RatingStore;
  pointerEvents: boolean;
}

const TICK_SIZE_PERCENT = 17;

const styles = {
  tickWrapperOuter: ({ business, quality }: Rating) =>
    css({
      position: "absolute",
      left: `${100 * business}%`,
      top: `${100 * (1 - quality)}%`,
      width: "100%",
      height: "100%",
    }),
  tickWrapperInner: css({
    width: `${TICK_SIZE_PERCENT}%`,
    height: `${TICK_SIZE_PERCENT}%`,
    marginLeft: `${-0.5 * TICK_SIZE_PERCENT}%`,
    marginTop: `${-0.5 * TICK_SIZE_PERCENT}%`,
    willChange: "transform",
  }),
};

const TickWrapperOuter = posed.div({
  enter: {},
  exit: {},
});

const TickWrapperInner = posed.div({
  enter: { scale: 1, opacity: 1 },
  exit: { scale: 0, opacity: 0 },
});

export default class RatingSquare extends React.Component<Props> {
  render() {
    const { store, render, pointerEvents } = this.props;
    const rating = store && store.rating;
    const state = store && store.getState();
    const labelStyle = (
      side: string,
      rotation: string,
      fullHeight: boolean,
    ): React.CSSProperties => ({
      position: "absolute",
      width: "100%",
      height: fullHeight ? "100%" : undefined,
      [side]: `${sizes.spacingPx / 2}px`,
      color: colors.machineLight,
      textAlign: "center",
      transform: `rotate(${rotation})`,
    });
    return [
      <Placed
        key="top"
        place={({ square, current, squareOpacity: o }: Derived) => ({
          w: square.w,
          h: square.h,
          x: current.x + current.w / 2 - square.w / 2,
          y: current.y,
          style: {
            opacity: o,
            pointerEvents: pointerEvents ? undefined : "none",
          },
        })}
        render={render}
      >
        <div style={labelStyle("top", "0deg", false)}>Pretty good</div>
      </Placed>,
      <Placed
        key="bottom"
        place={({ square, current, squareOpacity: o }: Derived) => ({
          w: square.w,
          h: square.h,
          x: current.x + current.w / 2 - square.w / 2,
          y: current.y + current.h - square.h,
          style: {
            opacity: o,
            pointerEvents: pointerEvents ? undefined : "none",
          },
        })}
        render={render}
      >
        <div style={labelStyle("bottom", "0deg", false)}>Terrible</div>
      </Placed>,
      <Placed
        key="left"
        place={({ square, current, squareOpacity: o }: Derived) => ({
          w: square.w,
          h: square.h,
          x: current.x,
          y: current.y,
          style: {
            opacity: o,
            pointerEvents: pointerEvents ? undefined : "none",
          },
        })}
        render={render}
      >
        <div style={labelStyle("left", "-90deg", true)}>No people</div>
      </Placed>,
      <Placed
        key="right"
        place={({ square, current, squareOpacity: o }: Derived) => ({
          w: square.w,
          h: square.h,
          x: current.x + current.w - square.w,
          y: current.y,
          style: {
            opacity: o,
            pointerEvents: pointerEvents ? undefined : "none",
          },
        })}
        render={render}
      >
        <div style={labelStyle("right", "90deg", true)}>Huge queue</div>
      </Placed>,
      <Placed
        key="tapArea"
        place={({ square, squareOpacity: o }: Derived) => ({
          ...square,
          style: {
            opacity: o,
            pointerEvents: pointerEvents ? undefined : "none",
          },
        })}
        render={render}
      >
        <TapArea
          onTap={({ x, y }) =>
            store && store.onTapRating({ business: x, quality: 1 - y })
          }
        >
          <PoseGroup animateOnMount>
            {rating
              ? [
                  <TickWrapperOuter
                    key={`${rating.quality}:${rating.business}`}
                    {...styles.tickWrapperOuter(rating)}
                  >
                    <TickWrapperInner {...styles.tickWrapperInner}>
                      <SaveTick tick={state === RatingState.Ok} size="100%" />
                    </TickWrapperInner>
                  </TickWrapperOuter>,
                ]
              : []}
          </PoseGroup>
        </TapArea>
      </Placed>,
    ];
  }
}
