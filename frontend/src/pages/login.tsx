import * as React from "react";
import { LoginStore } from "../store";
import { css } from "glamor";
import Button from "../components/button";
import Input from "../components/input";
import Header from "../components/header";
import { sizes, smallDeviceMediaQuery } from "../style";

interface Props {
  store: LoginStore;
}

const styles = {
  wrapper: css({
    padding: `${sizes.spacingPx[3]}px ${sizes.spacingPx[1]}px`,

    [smallDeviceMediaQuery]: {
      padding: `${sizes.spacingPx[2]}px ${sizes.spacingPx[0]}px`,
    },
  }),
  usernameInput: css({
    marginBottom: sizes.spacingPx[0],
  }),
  loginButton: css({
    margin: `${sizes.spacingPx[2]}px auto 0 auto`,
  }),
};

export default class LoginPage extends React.Component<Props> {
  render() {
    const { store } = this.props;
    if (store.initializing) {
      return null;
    }
    return (
      <form onSubmit={this.onSubmitForm}>
        <Header />
        <div {...styles.wrapper}>
          <Input
            className={styles.usernameInput.toString()}
            value={store.username}
            onChange={store.onUsernameChange}
            placeholder="Username"
            autoFocus
          />
          <Input
            type="password"
            value={store.password}
            onChange={store.onPasswordChange}
            placeholder="Password"
          />
          <Button
            type="submit"
            className={styles.loginButton.toString()}
            disabled={!(store.username && store.password) || store.inProgress}
          >
            Login
          </Button>
        </div>
      </form>
    );
  }

  onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.store.onLogin();
  };
}
