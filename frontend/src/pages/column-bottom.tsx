import * as React from "react";
import { ColumnStore } from "../store";
import { sizes, colors } from "../style";
import { css } from "glamor";
import Button from "../components/button";
import LinkButton from "../components/link-button";

interface Props {
  store: ColumnStore;
}

const styles = {
  doneButton: css({
    margin: `${sizes.spacingPx[3]}px auto ${sizes.spacingPx[2]}px auto`,
  }),
  cannotButtonWrapper: css({
    color: colors.contentLight,
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
