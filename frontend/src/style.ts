import { config as springConfigs } from "react-spring";
import { RENDER_DEBUG } from "./util";

const b = {
  greys: [
    "#333333",
    "#4B4542",
    "#535353",
    "#808080",
    "#C4C4C4",
    "#E5E5E5",
    "#FAFAF8",
  ],
  theme: "#AF813D",
  themeDarker: "#A05A2C",
  themeLighter: "#FFF7E2",
};

export const colors = {
  fakePhoneBorder: "#989898",

  background: b.greys[6],
  content: b.greys[0],
  contentLight: b.greys[3],

  machineDark: b.greys[2],
  machineMedium: b.greys[3],
  machineMediumLight: b.greys[4],
  machineLight: b.greys[5],
  coffee: "#A05A2C",
  coffeeDarkRGB: [0x85, 0x44, 0x19],
  coffeeLightRGB: [0xd1, 0xa5, 0x64],
  cup: "#FFFFFF",

  primaryBackground: b.theme,
  primaryDetail: b.themeDarker,
  primaryContent: "#FFFFFF",

  focusedBackground: "#FFFFFF",
  focusedBorder: b.theme,
  focusedContent: b.greys[0],
  focusedPlaceholder: b.greys[4],
  focusedSelectionBackground: b.theme,
  focusedSelectionContent: "#FFFFFF",

  unfocusedBackground: "#FFFFFF",
  unfocusedBorder: b.greys[4],
  unfocusedContent: b.greys[0],
  unfocusedPlaceholder: b.greys[4],
  unfocusedSelectionBackground: b.greys[4],
  unfocusedSelectionContent: b.greys[0],

  errorLight: "#FFEEEE",
  errorDark: "#B92525",

  autofillBackground: b.themeLighter,
};

export const sizes = {
  border: "2px",
  uiFontSize: "18px",
  titleFontSize: "45px",

  inputHeightPx: 55,
  buttonWidthPx: 150,
  tickSizePx: 57,

  smallDevice: {
    uiFontSize: "16px",
    titleFontSize: "36px",
    inputHeightPx: 45,
    buttonWidthPx: 120,
    tickSizePx: 45,
  },

  spacingPx: [16, 25, 32, 70],

  shadow: {
    blurPx: 4,
    offsetXPx: 3,
    offsetYPx: 5,
    opacity: 0.2,
  },
};

export const smallDeviceMediaQuery = "@media(max-width: 325px)";
export const tooSmallWidth = "250px";

export const springConfigMain = RENDER_DEBUG
  ? springConfigs.slow
  : { tension: 50, friction: 7 };

export const springConfigLoginSlide = { tension: 50, friction: 8.75 };

export const springConfigCup = { tension: 120, friction: 17 };
