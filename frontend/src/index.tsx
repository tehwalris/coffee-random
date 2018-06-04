import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./app";
import registerServiceWorker from "./registerServiceWorker";
import { css } from "glamor";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "normalize.css";
import { colors } from "./style";
import { RENDER_DEBUG } from "./util";

css.global("body", {
  margin: 0,
  padding: 0,
  overflow: "hidden",
  backgroundColor: colors.machineMedium,
  color: colors.content,
  userSelect: "none",
  perspective: RENDER_DEBUG ? "1000px" : undefined,
});

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
registerServiceWorker();
