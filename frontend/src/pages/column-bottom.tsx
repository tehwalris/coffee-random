import * as React from "react";
import { ColumnStore } from "../store";
import { sizes } from "../style";
import { css } from "glamor";
import Button from "../components/button";
import LinkButton from "../components/link-button";

interface Props {
  store: ColumnStore;
}

const styles = {
  doneButton: css({
    margin: `${2 * sizes.spacingPx}px auto ${sizes.spacingPx}px auto`,
  }),
  cannotButtonWrapper: css({
    textAlign: "center",
  }),
};

export default ({ store }: Props) => (
  <div>
    <Button onClick={store.onDone} className={styles.doneButton.toString()}>
      Done!
    </Button>
    <div {...styles.cannotButtonWrapper}>
      <LinkButton onClick={store.onCannot}>It's broken</LinkButton>
    </div>
  </div>
);
