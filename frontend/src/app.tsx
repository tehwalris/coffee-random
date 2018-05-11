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

  state: State = { store: new LoginStore(this.onUpdate) };

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

  renderLayoutDev() {
    const noop = () => {
      /*noop*/
    };
    return (
      <div {...styles.layoutDevWrapper}>
        <div {...styles.fakePhone}>
          <LoginPage store={this.state.store as LoginStore} />
        </div>
        <div {...styles.fakePhone}>
          <ColumnPage store={new ColumnStore(noop)} />
        </div>
        <div {...styles.fakePhone}>
          <RatingPage store={new RatingStore(noop)} />
        </div>
      </div>
    );
  }
}

export default App;
