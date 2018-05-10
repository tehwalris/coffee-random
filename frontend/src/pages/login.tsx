import * as React from "react";
import { LoginStore } from "../store";
import { ControlGroup, InputGroup, Intent } from "@blueprintjs/core";
import { css } from "glamor";
import SaveTick from "../components/save-tick";
import Button from "../components/button";
import Input from "../components/input";
import Header from "../components/header";
import { sizes } from "../style";

interface Props {
  store: LoginStore;
}

const styles = {
  wrapper: css({
    padding: `${2 * sizes.pagePaddingPx}px ${sizes.pagePaddingPx}px`,
  }),
  input: css({
    marginBottom: sizes.spacingPx,
  }),
  loginButton: css({
    margin: "0 auto",
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
            className={styles.input.toString()}
            focused={true}
            value={store.username}
            onChange={store.onUsernameChange}
            placeholder="Username"
          />
          <Input
            type="password"
            className={styles.input.toString()}
            focused={false}
            value={store.password}
            onChange={store.onPasswordChange}
            placeholder="Password"
            {...styles.input}
          />
          <Button
            type="submit"
            className={styles.loginButton.toString()}
            disabled={!(store.username && store.password) || store.inProgress}
          >
            Login
          </Button>
          <SaveTick tick={true} />
          <ControlGroup vertical>
            <InputGroup
              value={store.username}
              leftIcon="person"
              placeholder="Username"
              intent={store.failed ? Intent.DANGER : undefined}
              large
            />
            <InputGroup
              type="password"
              value={store.password}
              leftIcon="lock"
              placeholder="Password"
              intent={store.failed ? Intent.DANGER : undefined}
              large
            />
          </ControlGroup>
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
