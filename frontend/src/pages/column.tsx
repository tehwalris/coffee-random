import * as React from "react";
import { ColumnStore } from "../store";
import { Button, Intent } from "@blueprintjs/core";

interface Props {
  store: ColumnStore;
}

export default ({ store }: Props) => (
  <div>
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
