import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./app";
import registerServiceWorker from "./registerServiceWorker";
import { css } from "glamor";

css.global("body", {
  margin: 0,
  padding: 0,
  minWidth: "600px"
});

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
registerServiceWorker();
