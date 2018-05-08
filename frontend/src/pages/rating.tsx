import * as React from "react";
import { RatingStore, RatingState } from "../store";
import TapArea from "../components/tap-area";
import Square from "../components/square";

interface Props {
  store: RatingStore;
}

export default ({ store }: Props) => {
  let text = "Tap to rate";
  if (store.rating) {
    const s = store.getState();
    if (s === RatingState.Saving) {
      text = "Saving...";
    } else if (s === RatingState.Ok) {
      text = "Saved, tap to adjust";
    } else if (s === RatingState.Error) {
      text = "Failed to save";
    }
  }
  return (
    <div>
      <Square width={"80%"}>
        <TapArea
          onTap={({ x, y }) => store.onTapRating({ quality: x, business: y })}
        >
          {text}
        </TapArea>
      </Square>
    </div>
  );
};
