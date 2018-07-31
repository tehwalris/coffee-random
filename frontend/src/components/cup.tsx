import * as React from "react";
import { colors } from "../style";
import Ratio from "./ratio";

interface Props {
  width: string;
  center?: boolean;
}

const HEIGHT = 0.65;

export default class Cup extends React.PureComponent<Props> {
  render() {
    const { width, center } = this.props;
    return (
      <Ratio ratio={HEIGHT} width={width}>
        <svg
          viewBox={`${center ? "0.5" : "0"},0,1,${HEIGHT}`}
          width="100%"
          height="100%"
          style={{ overflow: "visible" }}
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
