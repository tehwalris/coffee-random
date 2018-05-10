import * as React from "react";
import { css } from "glamor";
import { sizes } from "../style";

interface Props {
  className?: string;
  type?: "password";
  focused: boolean;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}

const sharedStyles = {
  input: css({
    width: "100%",
    height: sizes.inputHeightPx,
    padding: "none",
    fontSize: sizes.uiFontSize,
  }),
};

const focusedStyles = {
  input: css({}),
};

const unfocusedStyles = {
  input: css({}),
};

export default class Input extends React.Component<Props> {
  render() {
    const { className, type, value, placeholder } = this.props;
    const currentStyles = this.props.focused ? focusedStyles : unfocusedStyles;
    return (
      <input
        className={className}
        type={type || "text"}
        value={value}
        placeholder={placeholder}
        onChange={this.onChange}
        {...sharedStyles.input}
        {...currentStyles.input}
      />
    );
  }

  private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange(e.target.value);
  };
}
