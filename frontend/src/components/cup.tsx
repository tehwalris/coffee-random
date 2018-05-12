import * as React from "react";
import { colors } from "../style";
import Ratio from "./ratio";

interface Props {
  width: string;
  center?: boolean;
  tilt?: string;
}

const HEIGHT = 0.65;

export default ({ width, center, tilt }: Props) => {
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
};

// TODO tilt
/*
  return (
    <div
      style={{
        borderTop: `${height}px solid ${colors.cup}`,
        borderLeft: `${inset}px solid transparent`,
        borderRight: `${inset}px solid transparent`,
        height: 0,
        width: widthPx,
        transform: tilt ? `rotate(${tilt}) translateY(-8%)` : undefined,
        transformOrigin: `${100 * (1 - INSET)}% bottom`,
      }}
    />
  );
  */
