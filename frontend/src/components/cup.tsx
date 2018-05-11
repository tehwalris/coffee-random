import * as React from "react";
import { colors } from "../style";

interface Props {
  widthPx: number;
  tilt?: string;
}

const HEIGHT = 0.65;
const INSET = 0.15;

export default ({ widthPx, tilt }: Props) => {
  const height = Math.floor(HEIGHT * widthPx);
  const inset = Math.floor(INSET * widthPx);
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
};
