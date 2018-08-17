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
}

const TICK_SIZE_PERCENT = 17;

const styles = {
  ratingSquareInner: css({
    position: "relative",
    height: "100%",
    color: colors.machineLight,
    fontSize: sizes.uiFontSizeSmall,
  }),
  label: (side: string, rotation: string, fullHeight: boolean) =>
    css({
      position: "absolute",
      width: "100%",
      height: fullHeight ? "100%" : undefined,
      [side]: `${sizes.spacingPx / 2}px`,
      textAlign: "center",
      transform: `rotate(${rotation})`,
    }),
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
    const { store, render } = this.props;
    const rating = store && store.rating;
    const state = store && store.getState();
    const whole = (
      <TapArea
        onTap={({ x, y }) =>
          store && store.onTapRating({ business: x, quality: 1 - y })
        }
      >
        <div {...styles.ratingSquareInner}>
          <div {...styles.label("top", "0deg", false)}>Pretty good</div>
          <div {...styles.label("bottom", "0deg", false)}>Terrible</div>
          <div {...styles.label("left", "-90deg", true)}>No people</div>
          <div {...styles.label("right", "90deg", true)}>Huge queue</div>
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
        </div>
      </TapArea>
    );
    return [
      <Placed
        key="whole"
        place={({ square, squareOpacity: o }: Derived) => ({
          ...square,
          style: { opacity: o },
        })}
        render={render}
      >
        {whole}
      </Placed>,
    ];
  }
}
