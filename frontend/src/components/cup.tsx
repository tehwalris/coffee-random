import * as React from "react";
import { colors } from "../style";
import Ratio from "./ratio";
import { css } from "glamor";

// Cup is just the "signature" cup as an SVG.

interface Props {
  width: string;
  center?: boolean;
}

const HEIGHT = 0.65;

const styles = {
  svg: css({
    display: "block",
    overflow: "visible",
  }),
};

export default class Cup extends React.PureComponent<Props> {
  render() {
    const { width, center } = this.props;
    return (
      <Ratio ratio={HEIGHT} width={width}>
        <svg
          viewBox={`${center ? "0.5" : "0"},0,1,${HEIGHT}`}
          width="100%"
          height="100%"
          {...styles.svg}
        >
          <polygon
            points={`0,0 1,0 0.85,${HEIGHT} 0.15,${HEIGHT}`}
            fill={colors.cup}
          />
        </svg>
      </Ratio>
    );
  }
}
