import * as React from "react";
import { colors } from "../style";

interface Props {
  widthPx: number;
}

const HEGIHT = 0.65;
const INSET = 0.15;

export default ({ widthPx }: Props) => {
  const height = Math.floor(HEGIHT * widthPx);
  const inset = Math.floor(INSET * widthPx);
  return (
    <div
      style={{
        borderTop: `${height}px solid ${colors.cup}`,
        borderLeft: `${inset}px solid transparent`,
        borderRight: `${inset}px solid transparent`,
        height: 0,
        width: widthPx,
      }}
    />
  );
};
