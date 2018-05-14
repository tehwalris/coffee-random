import * as React from "react";
import { Store, LoginStore, ColumnStore, RatingStore } from "./store";
import LoginPage from "./pages/login";
import ColumnPage from "./pages/column";
import RatingPage from "./pages/rating";
import { css } from "glamor";
import { colors } from "./style";
import { unreachable } from "./util";
import posed, { PoseGroup } from "react-pose";

interface State {
  store: Store;
  storeIndex: number; // incremented each time store is moved to lastStore
  lastStore?: Store; // store is moved here when the page (store class) changes
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
  outer: css({
    position: "relative",
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
  inner: css({
    position: "absolute",
    width: "100%",
    height: "100%",
  }),
};

const Page = posed.div({
  enter: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
});

class App extends React.Component<{}, State> {
  private onUpdate = (store: Store) => {
    const { storeIndex, store: oldStore } = this.state;
    //tslint:disable-next-line:no-any
    if ((store as any).constructor !== (oldStore as any).constructor) {
      this.setState({
        lastStore: oldStore,
        storeIndex: storeIndex + 1,
      });
    }
    this.setState({
      store,
    });
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
    storeIndex: 0,
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
    const { store, storeIndex } = this.state;
    return (
      <div {...styles.outer}>
        <PoseGroup animateOnMount>
          {[
            <Page key={storeIndex} {...styles.inner}>
              {this.renderInner(store)}
            </Page>,
          ]}
        </PoseGroup>
      </div>
    );
  }

  renderInner(store: Store) {
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
          <div key={i} {...styles.outer} {...styles.fakePhone}>
            {e}
          </div>
        ))}
      </div>
    );
  }
}

export default App;
