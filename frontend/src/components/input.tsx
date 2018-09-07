import * as React from "react";
import { css, select as glamorSelect, keyframes } from "glamor";
import { sizes, colors, smallDeviceMediaQuery } from "../style";
import { ANIMATION_SLOWDOWN } from "../util";

interface Props {
  className?: string;
  type?: "password";
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoFocus?: boolean;
  error: boolean;
}

const focusedInputStyles = {
  color: colors.focusedContent,
  borderColor: colors.focusedBorder,
  backgroundColor: colors.focusedBackground,
  "::placeholder": { color: colors.focusedPlaceholder },
  "::selection": {
    backgroundColor: colors.focusedSelectionBackground,
    color: colors.focusedSelectionContent,
  },
};

const unfocusedInputStyles = {
  color: colors.unfocusedContent,
  borderColor: colors.unfocusedBorder,
  backgroundColor: colors.unfocusedBackground,
  "::placeholder": { color: colors.unfocusedPlaceholder },
  "::selection": {
    backgroundColor: colors.unfocusedSelectionBackground,
    color: colors.unfocusedSelectionContent,
  },
};

// HACK Set the background color for autofilled inputs.
// Based on this: https://css-tricks.com/snippets/css/change-autocomplete-styles-webkit-browsers/
// It won't always work, but when it does, it will look a little nicer without being too confusing.
const setAutofillBackground = (color: string) =>
  glamorSelect(
    ":-webkit-autofill",
    css({
      animation: `1s ${keyframes({
        from: {
          backgroundColor: color,
          color: "inherit",
        },
        to: {},
      })}`,
      animationPlayState: "paused",
    }),
  );

const filledPasswordStyles = {
  fontFamily: "caption",
  fontSize: 20,
};

const styles = {
  input: css({
    boxSizing: "border-box",
    width: "100%",
    height: sizes.inputHeightPx,
    margin: 0,
    padding: `0 ${sizes.spacingPx[0]}px !important`,
    borderWidth: sizes.border,
    borderStyle: "solid",
    fontSize: "inherit",
    fontFamily: "inherit",
    boxShadow: [
      "inset",
      sizes.shadow.offsetXPx / 3 + "px",
      sizes.shadow.offsetYPx / 3 + "px",
      sizes.shadow.blurPx + "px",
      `rgba(0, 0, 0, ${sizes.shadow.opacity})`,
    ].join(" "),
    transition: `border ${0.1 * ANIMATION_SLOWDOWN}s ease`,

    ":focus": {
      ...focusedInputStyles,
      outline: "none",
    },

    ":not(:focus)": unfocusedInputStyles,

    '[type="password"]:not(:placeholder-shown)': filledPasswordStyles,
    '[type="password"]:-webkit-autofill': filledPasswordStyles,

    [smallDeviceMediaQuery]: {
      height: sizes.smallDevice.inputHeightPx,
    },
  }),
  autofillNormal: setAutofillBackground(colors.autofillBackground),
  autofillError: setAutofillBackground(colors.errorLight),
  inputError: css({
    backgroundColor: colors.errorLight + " !important",

    ":focus": {
      borderColor: colors.errorDark + " !important",

      "::selection": {
        backgroundColor: colors.errorDark + " !important",
      },
    },
  }),
};

export default class Input extends React.Component<Props> {
  render() {
    const {
      className,
      type,
      value,
      placeholder,
      autoFocus,
      error,
    } = this.props;
    return (
      <input
        className={className}
        type={type || "text"}
        value={value}
        placeholder={placeholder}
        onChange={this.onChange}
        autoFocus={autoFocus}
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        {...styles.input}
        {...(error ? styles.autofillError : styles.autofillNormal)}
        {...(error ? styles.inputError : {})}
      />
    );
  }

  private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange(e.target.value);
  };
}
