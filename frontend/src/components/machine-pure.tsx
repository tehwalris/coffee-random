import * as React from "react";
import { css } from "glamor";
import { colors } from "../style";
import Head from "./head";
import Cup from "./cup";
import { mix } from "../util";
import Placed from "./placed";
import { Derived } from "./composite-page";
import { PlaceableProps } from "./placement-parent";

export interface Props extends PlaceableProps<Derived> {
  arrowPos: number; // 1 is left head, 4 is right head, any float values are allowed
  heads: Heads;
  coffee: number; // [0, 1] // 0 - no coffee, 0.5 - full coffee, 1 - no coffee (0.25 some coffee from the top)
  blonding: number; // [0, 1] // 0 - dark coffee, 1 - blonde coffee
}

// see head.tsx
export interface HeadProps {
  door: number;
  light: boolean;
}

export type Heads = [HeadProps, HeadProps, HeadProps, HeadProps];

const CUP_WIDTH_PERCENT = 8;
const COFFEE_WIDTH_PERCENT = 1;
const COFFEE_TOP = -5;
const COFFEE_BOTTOM = 68;

const styles = {
  cupWrapper: css({
    position: "absolute",
    width: "100%",
    bottom: 0,
  }),
  coffee: css({
    willChange: "transform",
    position: "absolute",
    width: `${COFFEE_WIDTH_PERCENT}%`,
    marginLeft: `${-0.5 * COFFEE_WIDTH_PERCENT}%`,
  }),
};

function dynamicCoffeeStyles(t: number, b: number): React.CSSProperties {
  const top = mix(COFFEE_TOP, COFFEE_BOTTOM, Math.max(0, 2 * t - 1));
  const bottom = mix(COFFEE_TOP, COFFEE_BOTTOM, Math.min(1, 2 * t));
  const color = colors.coffeeDarkRGB.map((v, i) =>
    mix(v, colors.coffeeLightRGB[i], b),
  );
  return {
    willChange: "transform",
    position: "absolute",
    top: `${top}%`,
    width: `${COFFEE_WIDTH_PERCENT}%`,
    height: `${bottom - top}%`,
    marginLeft: `${-0.5 * COFFEE_WIDTH_PERCENT}%`,
    background: `rgb(${color.map(Math.floor).join(", ")})`,
  };
}

export default class MachinePure extends React.Component<Props> {
  render() {
    const { arrowPos, heads, coffee, blonding, render } = this.props;
    return [
      <Placed
        key="cup"
        place={({ midLayer, machineOpacity: o }: Derived) => ({
          ...midLayer(arrowPos, true),
          style: { opacity: o },
        })}
        render={render}
      >
        <div {...styles.cupWrapper}>
          <Cup width={`${CUP_WIDTH_PERCENT}%`} center />
        </div>
      </Placed>,
      <Placed
        key="coffee"
        place={({ midLayer, machineOpacity: o }: Derived) => ({
          ...midLayer(arrowPos, false),
          style: { opacity: o },
        })}
        render={render}
      >
        <div {...styles.coffee} style={dynamicCoffeeStyles(coffee, blonding)} />
      </Placed>,
      ...[0, 1, 2, 3].map(i => (
        <Placed
          key={`head ${i}`}
          place={({ heads: h, machineOpacity: o }: Derived) => ({
            ...h[i],
            style: { opacity: o },
          })}
          render={render}
        >
          <Head
            key={i}
            width="100%"
            door={heads[i].door}
            light={heads[i].light}
          />
        </Placed>
      )),
      ...[0, 1].map(i => (
        <Placed
          key={`platform ${i}`}
          place={({ platforms, machineOpacity: o }: Derived) => ({
            ...platforms[i],
            style: { backgroundColor: colors.machineLight, opacity: o },
          })}
          render={render}
        />
      )),
    ];
  }
}
