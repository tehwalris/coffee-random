import * as React from "react";
import { LoginStore } from "../store";
import { ControlGroup, InputGroup, Intent, Button } from "@blueprintjs/core";
import { css } from "glamor";

interface Props {
  store: LoginStore;
}

const styles = {
  loginButton: css({
    width: "100%",
    marginTop: "15px",
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
        <ControlGroup vertical>
          <InputGroup
            value={store.username}
            onChange={this.onUsernameChange}
            leftIcon="person"
            placeholder="Username"
            intent={store.failed ? Intent.DANGER : undefined}
            large
          />
          <InputGroup
            type="password"
            value={store.password}
            onChange={this.onPasswordChange}
            leftIcon="lock"
            placeholder="Password"
            intent={store.failed ? Intent.DANGER : undefined}
            large
          />
        </ControlGroup>
        <Button
          type="submit"
          intent={Intent.PRIMARY}
          large
          className={styles.loginButton.toString()}
          disabled={!(store.username && store.password) || store.inProgress}
        >
          Login
        </Button>
      </form>
    );
  }

  onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.store.onLogin();
  };

  onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.store.onUsernameChange(e.target.value);
  };

  onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.store.onPasswordChange(e.target.value);
  };
}
