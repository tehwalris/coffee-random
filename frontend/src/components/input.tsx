import * as React from "react";
import { css, select as glamorSelect, keyframes } from "glamor";
import { sizes, colors } from "../style";

interface Props {
  className?: string;
  type?: "password";
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoFocus?: boolean;
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

const styles = {
  input: css({
    boxSizing: "border-box",
    width: "100%",
    height: sizes.inputHeightPx,
    margin: 0,
    padding: `0 ${sizes.spacingPx[0]}px !important`,
    borderWidth: sizes.border,
    borderStyle: "solid",
    fontSize: sizes.uiFontSize,
    fontFamily: "inherit",
    boxShadow: [
      "inset",
      sizes.shadow.offsetXPx / 3 + "px",
      sizes.shadow.offsetYPx / 3 + "px",
      sizes.shadow.blurPx + "px",
      `rgba(0, 0, 0, ${sizes.shadow.opacity})`,
    ].join(" "),

    ":focus": {
      ...focusedInputStyles,
      outline: "none",
    },

    ":not(:focus)": unfocusedInputStyles,
  }),

  // HACK Set the background color for autofilled inputs.
  // Based on this: https://css-tricks.com/snippets/css/change-autocomplete-styles-webkit-browsers/
  // It won't always work, but when it does, it will look a little nicer without being too confusing.
  inputAutofill: glamorSelect(
    ":-webkit-autofill",
    css({
      animation: `1s ${keyframes({
        from: {
          backgroundColor: colors.autofillBackground,
          color: "inherit",
        },
        to: {},
      })}`,
      animationPlayState: "paused",
    }),
  ),
};

export default class Input extends React.Component<Props> {
  render() {
    const { className, type, value, placeholder, autoFocus } = this.props;
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
        {...styles.inputAutofill}
        style={
          type === "password"
            ? { fontFamily: "caption", fontSize: 20 }
            : undefined
        }
      />
    );
  }

  private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange(e.target.value);
  };
}
