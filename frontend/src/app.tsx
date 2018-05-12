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

const LAYOUT_DEV = true;

const styles = {
  layoutDevWrapper: css({
    display: "flex",
    justifyContent: "center",
  }),
  fakePhone: css({
    height: "590px",
    width: "360px",
    margin: "20px 10px",
    border: `1px solid ${colors.fakePhoneBorder}`,
    backgroundColor: colors.background,
    color: colors.content,
  }),
};

class App extends React.Component<{}, State> {
  private onUpdate = (store: Store) => {
    this.setState({ store });
  };

  private onUpdateDev = (store: Store) => {
    if (!this.state) {
      // HACK this is for the dev mode anyway
      console.log("HACK delaying");
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
        <div {...styles.fakePhone}>
          <LoginPage store={login} />
        </div>
        <div {...styles.fakePhone}>
          <ColumnPage store={column} />
        </div>
        <div {...styles.fakePhone}>
          <RatingPage store={rating} />
        </div>
      </div>
    );
  }
}

export default App;
