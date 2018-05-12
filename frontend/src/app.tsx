import * as React from "react";
import { Store, LoginStore, ColumnStore, RatingStore } from "./store";
import LoginPage from "./pages/login";
import ColumnPage from "./pages/column";
import RatingPage from "./pages/rating";
import { css } from "glamor";
import { colors } from "./style";
import { unreachable } from "./util";

interface State {
  store: Store;
  dev: {
    login: LoginStore;
    column: ColumnStore;
    rating: RatingStore;
  };
}

const LAYOUT_DEV = false;

const styles = {
  layoutDevWrapper: css({
    display: "flex",
    justifyContent: "center",
  }),
  fakePhone: css({
    margin: "20px 10px",
    border: `1px solid ${colors.fakePhoneBorder}`,
  }),
  wrapper: css({
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    backgroundColor: colors.background,
    color: colors.content,

    "@media(min-width: 450px)": {
      height: "570px",
      width: "360px",
      margin: "100px auto",
      boxShadow: "0 20px 100px rgba(0, 0, 0, 0.5)",
      outline: "1px solid rgba(0, 0, 0, 0.1)",
    },
  }),
};

class App extends React.Component<{}, State> {
  private onUpdate = (store: Store) => {
    this.setState({ store });
  };

  private onUpdateDev = (store: Store) => {
    if (!this.state) {
      // HACK this is for the dev mode anyway
      console.log("HACK delaying"); // tslint:disable-line:no-console
      setTimeout(() => this.onUpdateDev(store), 100);
      return;
    }
    const { dev } = this.state;
    if (store instanceof LoginStore) {
      this.setState({ dev: { ...dev, login: store } });
    }
    if (store instanceof ColumnStore) {
      this.setState({ dev: { ...dev, column: store } });
    }
    if (store instanceof RatingStore) {
      this.setState({ dev: { ...dev, rating: store } });
    }
  };

  state: State = {
    store: new LoginStore(this.onUpdate),
    dev: {
      login: new LoginStore(this.onUpdateDev),
      column: new ColumnStore(this.onUpdateDev),
      rating: new RatingStore(this.onUpdateDev),
    },
  };

  render() {
    return <div {...styles.wrapper}>{this.renderInner()}</div>;
  }

  renderInner() {
    if (LAYOUT_DEV) {
      return this.renderLayoutDev();
    }
    const { store } = this.state;
    if (store instanceof LoginStore) {
      return <LoginPage store={store} />;
    }
    if (store instanceof ColumnStore) {
      return <ColumnPage store={store} />;
    }
    if (store instanceof RatingStore) {
      return <RatingPage store={store} />;
    }
    return unreachable(store);
  }

  private renderLayoutDev() {
    const {
      dev: { login, column, rating },
    } = this.state;
    return (
      <div {...styles.layoutDevWrapper}>
        {[
          <LoginPage store={login} />,
          <ColumnPage store={column} />,
          <RatingPage store={rating} />,
        ].map((e, i) => (
          <div key={i} {...styles.wrapper} {...styles.fakePhone}>
            {e}
          </div>
        ))}
      </div>
    );
  }
}

export default App;
