import { ANIMATION_SLOWDOWN } from "./util";

type SpringConfig = {
  friction: number;
  tension: number;
};

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
export const tooSmallWidthPx = 250;

function slowDownSpring(c: SpringConfig): SpringConfig {
  return {
    tension: c.tension / ANIMATION_SLOWDOWN ** 2,
    friction: c.friction / ANIMATION_SLOWDOWN,
  };
}

// fromReactSpring converts a config for react-spring into
// a config for a standard spring like in spring.ts.
function fromReactSpring(c: SpringConfig): SpringConfig {
  return {
    tension: (c.tension - 30) * 3.62 + 194,
    friction: (c.friction - 8) * 3 + 25,
  };
}

// toReactSpring is the inverse of fromReactSpring
function toReactSpring(c: SpringConfig): SpringConfig {
  return {
    tension: (c.tension - 194) / 3.62 + 30,
    friction: (c.friction - 25) / 3 + 8,
  };
}

// react-spring uses applies a transformation before
// using the constants in its config for simulation, so
// slowDownSpring can not work react-spring configs directly.
const slowDownReactSpring = (c: SpringConfig) =>
  toReactSpring(slowDownSpring(fromReactSpring(c)));

export const springConfigMain = slowDownReactSpring({
  tension: 50,
  friction: 7,
});
export const springConfigLoginSlide = slowDownReactSpring({
  tension: 50,
  friction: 8.75,
});
export const springConfigCup = slowDownSpring({ tension: 120, friction: 17 });
