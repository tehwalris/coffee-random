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
  themeAlt: "#AF813D",
};

export const colors = {
  fakePhoneBorder: "#989898",

  background: b.greys[6],
  content: b.greys[0],
  contentLight: b.greys[3],

  machineDark: b.greys[2],
  machineMedium: b.greys[3],
  machineLight: b.greys[5],
  coffee: "#A05A2C",
  coffeeDarkRGB: [0x85, 0x44, 0x19],
  coffeeLightRGB: [0xd1, 0xa5, 0x64],
  cup: "#FFFFFF",

  primaryBackground: b.theme,
  primaryDetail: b.themeAlt,
  primaryContent: "#FFFFFF",

  focusedBackground: "#FFFFFF",
  focusedBorder: b.theme,
  focusedContent: b.greys[0],
  focusedPlaceholder: b.greys[4],

  unfocusedBackground: "#FFFFFF",
  unfocusedBorder: b.greys[4],
  unfocusedContent: b.greys[0],
  unfocusedPlaceholder: b.greys[4],
};

export const sizes = {
  border: "2px",
  uiFontSize: "18px",
  titleFontSize: "40px",

  inputHeightPx: 55,
  buttonWidthPx: 150,
  tickSizePx: 60,
  spacingPx: [16, 25, 32, 60],
};
