import * as React from "react";
import { ColumnStore } from "../store";
import { sizes } from "../style";
import { css } from "glamor";
import Machine from "../components/machine";
import Button from "../components/button";
import LinkButton from "../components/link-button";

interface Props {
  store: ColumnStore;
}

const styles = {
  title: css({
    margin: `${2 * sizes.pagePaddingPx}px ${sizes.pagePaddingPx}px`,
    textAlign: "center",
    fontSize: sizes.titleFontSize,
  }),
  doneButton: css({
    margin: `${2 * sizes.spacingPx}px auto ${sizes.spacingPx}px auto`,
  }),
  cannotButtonWrapper: css({
    textAlign: "center",
  }),
};

export default ({ store }: Props) => (
  <div>
    <div {...styles.title}>
      Make your<br />coffee here
    </div>
    <Machine column={store.column} />
    <Button onClick={store.onDone} className={styles.doneButton.toString()}>
      Done!
    </Button>
    <div {...styles.cannotButtonWrapper}>
      <LinkButton onClick={store.onCannot}>It's broken</LinkButton>
    </div>
  </div>
);

// TODO "can't" button

/*
    <Button intent={Intent.PRIMARY} large onClick={store.onDone}>
      Done!
    </Button>
    <Button large onClick={store.onCannot}>
      I can't use that one
    </Button>
    */
