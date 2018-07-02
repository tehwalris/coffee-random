import * as React from "react";
import { Store, LoginStore, ColumnStore, RatingStore } from "./store";
import ColumnTop from "./pages/column-top";
import ColumnBottom from "./pages/column-bottom";
import LoginPage from "./pages/login";
import RatingTop from "./pages/rating-top";
import CompositePage from "./components/composite-page";
import { css } from "glamor";
import { colors } from "./style";
import { unreachable, RENDER_DEBUG } from "./util";
import posed from "react-pose";
import { Target } from "./components/cover-animate";

interface State {
  store: Store;
  storeIndex: number; // incremented each time store is moved to lastStore
  lastStore?: Store; // store is moved here when the page (store class) changes
}

const styles = {
  outer: css({
    position: "relative",
    width: "100vw",
    height: "100vh",
    backgroundColor: colors.background,
    color: colors.content,

    overflow: RENDER_DEBUG ? "visible" : "hidden",
    transform: RENDER_DEBUG
      ? "translateY(-100px) scale(0.75) rotateX(32deg) rotateY(-9deg) rotateZ(26deg)"
      : undefined,
    transformStyle: RENDER_DEBUG ? "preserve-3d" : undefined,

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

const Section = posed.div({
  enter: {},
  exit: {},
});

class App extends React.Component<{}, State> {
  private onUpdate = (store: Store) => {
    if (!this.state) {
      // "onUpdate" can be called from the constructor of LoginStore
      // which runs before the initial state is assigned.
      setImmediate(() => this.onUpdate(store));
      return;
    }
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

  state: State = {
    store: new LoginStore(this.onUpdate),
    storeIndex: 0,
  };

  render() {
    const { store } = this.state;
    return (
      <div {...styles.outer}>
        <Section>{this.renderInner(store)}</Section>
      </div>
    );
  }

  renderInner(store: Store) {
    const { storeIndex } = this.state;
    if (store instanceof LoginStore) {
      return <LoginPage store={store} />;
    }
    if (store instanceof ColumnStore) {
      return (
        <CompositePage
          target={Target.Machine}
          top={<ColumnTop />}
          bottom={<ColumnBottom store={store} />}
          column={store.column}
          storeIndex={storeIndex}
        />
      );
    }
    if (store instanceof RatingStore) {
      return (
        <CompositePage
          target={Target.Square}
          top={<RatingTop />}
          bottom={<div />}
          column={store.column}
          storeIndex={storeIndex}
          ratingStore={store}
        />
      );
    }
    return unreachable(store);
  }
}

export default App;
