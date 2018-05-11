import * as React from "react";
import { ColumnStore } from "../store";
import { Button, Intent } from "@blueprintjs/core";
import { sizes } from "../style";
import { css } from "glamor";
import Machine from "../components/machine";

interface Props {
  store: ColumnStore;
}

const styles = {
  title: css({
    margin: `${2 * sizes.pagePaddingPx}px ${sizes.pagePaddingPx}px`,
    textAlign: "center",
    fontSize: sizes.titleFontSize,
  }),
};

export default ({ store }: Props) => (
  <div>
    <div {...styles.title}>
      Make your<br />coffee here
    </div>
    <Machine column={1} />
    {store.failed
      ? "Ok, try this column:"
      : "Take your coffee from this column:"}
    <b>{store.column}</b>
    <Button intent={Intent.PRIMARY} large onClick={store.onDone}>
      Done!
    </Button>
    <Button large onClick={store.onCannot}>
      I can't use that one
    </Button>
  </div>
);
