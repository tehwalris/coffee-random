import * as React from "react";
import { RatingStore, RatingState } from "../store";
import TapArea from "../components/tap-area";
import Ratio from "../components/ratio";

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
      <Ratio width="80%" ratio={1}>
        <TapArea
          onTap={({ x, y }) =>
            store.onTapRating({ business: x, quality: 1 - y })
          }
        >
          {text}
        </TapArea>
      </Ratio>
    </div>
  );
};
