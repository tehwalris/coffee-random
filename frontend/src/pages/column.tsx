import * as React from "react";
import { ColumnStore } from "../store";
import { sizes } from "../style";
import { css } from "glamor";
import Machine from "../components/machine";
import Button from "../components/button";
import LinkButton from "../components/link-button";
import Title from "../components/title";
import CoverAnimate, { Target } from "../components/cover-animate";

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
  lowerContent: css({
    position: "relative", // prevents this from being underneath CoverAnimate
  }),
};

export default ({ store }: Props) => (
  <div>
    <Title>
      Make your<br />coffee here
    </Title>
    <CoverAnimate target={Target.Machine}>
      <Machine column={store.column} />
    </CoverAnimate>
    <div {...styles.lowerContent}>
      <Button onClick={store.onDone} className={styles.doneButton.toString()}>
        Done!
      </Button>
      <div {...styles.cannotButtonWrapper}>
        <LinkButton onClick={store.onCannot}>It's broken</LinkButton>
      </div>
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
