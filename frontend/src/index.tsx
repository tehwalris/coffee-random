import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./app";
import registerServiceWorker from "./registerServiceWorker";
import { css } from "glamor";
import "normalize.css";
import { colors, tooSmallWidthPx } from "./style";

css.global("body", {
  margin: 0,
  padding: 0,
  overflowX: "hidden",
  overflowY: "auto",
  height: "100vh",
  backgroundColor: colors.machineMedium,
  color: colors.content,
  userSelect: "none",
  fontFamily: "Montserrat,Open Sans,Helvetica Neue,sans-serif",
});

css.insert(`@media(max-width: ${tooSmallWidthPx}px) {
  body {
    overflow-x: auto;
  }
}`);

css.global("#root", {
  overflow: "auto",
  height: "600px",
  minHeight: "100%",
  minWidth: tooSmallWidthPx,
});

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
registerServiceWorker();
