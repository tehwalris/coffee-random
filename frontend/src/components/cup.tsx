import * as React from "react";
import { colors } from "../style";

interface Props {
  width: string;
  center?: boolean;
  tilt?: string;
}

const HEIGHT = 0.65;

export default ({ width, center, tilt }: Props) => {
  return (
    <div style={{ display: "inline-grid" }}>
      <svg
        viewBox={`${center ? "0.5" : "0"},0,1,${HEIGHT}`}
        width={width}
        style={{ overflow: "visible" }}
      >
        <polygon
          points={`0,0 1,0 0.85,${HEIGHT} 0.15,${HEIGHT}`}
          fill={colors.cup}
        />
      </svg>
    </div>
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
