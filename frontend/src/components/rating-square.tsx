import * as React from "react";
import { RatingStore, Rating, RatingState } from "../store";
import TapArea from "./tap-area";
import { css } from "glamor";
import {
  sizes,
  colors,
  smallDeviceMediaQuery,
  springConfigMain,
} from "../style";
import SaveTick from "./save-tick";
import Placed from "./placed";
import { PlaceableProps } from "./placement-parent";
import { Transition } from "react-spring";
import { LayoutOutputs } from "../layout-composite-page";

// RatingSquare is a tappable sqaure input for taking ratings
// of coffee from the user.

interface Props extends PlaceableProps<LayoutOutputs> {
  store?: RatingStore;
  pointerEvents: boolean;
  stopInteraction: boolean;
}

const styles = {
  tickWrapperOuter: ({ business, quality }: Rating): React.CSSProperties => ({
    position: "absolute",
    left: `${100 * business}%`,
    top: `${100 * (1 - quality)}%`,
    width: "100%",
    height: "100%",
  }),
  tickWrapperInner: css({
    width: sizes.tickSizePx,
    height: sizes.tickSizePx,
    marginLeft: -0.5 * sizes.tickSizePx,
    marginTop: -0.5 * sizes.tickSizePx,
    willChange: "transform",

    [smallDeviceMediaQuery]: {
      width: sizes.smallDevice.tickSizePx,
      height: sizes.smallDevice.tickSizePx,
      marginLeft: -0.5 * sizes.smallDevice.tickSizePx,
      marginTop: -0.5 * sizes.smallDevice.tickSizePx,
    },
  }),
};

export default class RatingSquare extends React.Component<Props> {
  render() {
    const { store, render, pointerEvents, stopInteraction } = this.props;
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
      [side]: `${sizes.spacingPx[0]}px`,
      color: colors.machineLight,
      textAlign: "center",
      transform: `rotate(${rotation})`,
    });
    return [
      <Placed
        key="top"
        place={({ square, current, squareOpacity: o }: LayoutOutputs) => ({
          w: square.w,
          h: square.h,
          x: current.x + current.w / 2 - square.w / 2,
          y: current.y,
          style: {
            opacity: o,
            pointerEvents: pointerEvents ? undefined : "none",
          },
        })}
        updateFrom={() => false}
        render={render}
      >
        <div style={labelStyle("top", "0deg", false)}>Pretty good</div>
      </Placed>,
      <Placed
        key="bottom"
        place={({ square, current, squareOpacity: o }: LayoutOutputs) => ({
          w: square.w,
          h: square.h,
          x: current.x + current.w / 2 - square.w / 2,
          y: current.y + current.h - square.h,
          style: {
            opacity: o,
            pointerEvents: pointerEvents ? undefined : "none",
          },
        })}
        updateFrom={() => false}
        render={render}
      >
        <div style={labelStyle("bottom", "0deg", false)}>Terrible</div>
      </Placed>,
      <Placed
        key="left"
        place={({ square, current, squareOpacity: o }: LayoutOutputs) => ({
          w: square.w,
          h: square.h,
          x: current.x,
          y: current.y,
          style: {
            opacity: o,
            pointerEvents: pointerEvents ? undefined : "none",
          },
        })}
        updateFrom={() => false}
        render={render}
      >
        <div style={labelStyle("left", "-90deg", true)}>No people</div>
      </Placed>,
      <Placed
        key="right"
        place={({ square, current, squareOpacity: o }: LayoutOutputs) => ({
          w: square.w,
          h: square.h,
          x: current.x + current.w - square.w,
          y: current.y,
          style: {
            opacity: o,
            pointerEvents: pointerEvents ? undefined : "none",
          },
        })}
        updateFrom={() => false}
        render={render}
      >
        <div style={labelStyle("right", "90deg", true)}>Huge queue</div>
      </Placed>,
      <Placed
        key="tapArea"
        place={({ square, squareOpacity: o }: LayoutOutputs) => ({
          ...square,
          style: {
            opacity: o,
            pointerEvents: pointerEvents ? undefined : "none",
          },
        })}
        updateFrom={() => (stopInteraction ? false : {})}
        render={render}
      >
        <TapArea
          onTap={({ x, y }) =>
            store && store.onTapRating({ business: x, quality: 1 - y })
          }
        >
          <Transition
            keys={rating ? [`${rating.quality}:${rating.business}`] : []}
            from={{ opacity: 0, transform: "scale(0.5)" }}
            enter={{ opacity: 1, transform: "scale(1)" }}
            leave={{ opacity: 0, transform: "scale(0.5)" }}
            config={springConfigMain}
          >
            {rating
              ? [
                  (s: React.CSSProperties) => (
                    <div style={styles.tickWrapperOuter(rating)}>
                      <div {...styles.tickWrapperInner} style={s}>
                        <SaveTick
                          ratingState={
                            state === undefined ? RatingState.Saving : state
                          }
                          size="100%"
                        />
                      </div>
                    </div>
                  ),
                ]
              : []}
          </Transition>
        </TapArea>
      </Placed>,
    ];
  }
}
