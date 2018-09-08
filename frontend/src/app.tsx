import * as React from "react";
import { Store, LoginStore, ColumnStore, RatingStore } from "./store";
import ColumnTop from "./pages/column-top";
import ColumnBottom from "./pages/column-bottom";
import LoginPage from "./pages/login";
import RatingTop from "./pages/rating-top";
import CompositePage, { Target } from "./components/composite-page";
import { css } from "glamor";
import { colors, sizes, smallDeviceMediaQuery, tooSmallWidthPx } from "./style";
import { unreachable } from "./util";
import SlideDown from "./components/slide-down";
import FakeTouchCursor from "./components/fake-touch-cursor";

interface State {
  store: Store;
  storeIndex: number; // incremented each time store is moved to lastStore
  lastStore?: Store; // store is moved here when the page (store class) changes
  phoneDims: {
    widthPx: number;
    heightPx: number;
  };
}

const FAKE_PHONE = {
  breakPx: 450,
  heightPx: 640,
  widthPx: 360,
};

const USE_FAKE_CURSOR = document.body.clientWidth >= FAKE_PHONE.breakPx;

const styles = {
  outer: css({
    position: "relative",
    width: "100%",
    height: "100%",
    backgroundColor: colors.background,
    color: colors.content,
    fontSize: sizes.uiFontSize,
    overflow: "hidden",

    [`@media(min-width: ${FAKE_PHONE.breakPx}px)`]: {
      height: FAKE_PHONE.heightPx,
      width: FAKE_PHONE.widthPx,
      margin: "20px auto",
      boxShadow: "0 20px 100px rgba(0, 0, 0, 0.5)",
      outline: "1px solid rgba(0, 0, 0, 0.1)",
    },

    [smallDeviceMediaQuery]: {
      fontSize: sizes.smallDevice.uiFontSize,
    },
  }),
  inner: css({
    position: "absolute",
    width: "100%",
    height: "100%",
  }),
};

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
    phoneDims: { widthPx: 0, heightPx: 0 },
  };

  componentWillMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    const d = {
      widthPx: Math.max(window.innerWidth, tooSmallWidthPx),
      heightPx: window.innerHeight,
    };
    if (d.widthPx >= FAKE_PHONE.breakPx) {
      this.setState({ phoneDims: { ...FAKE_PHONE } });
    } else {
      this.setState({ phoneDims: d });
    }
  };

  render() {
    const { store } = this.state;
    return (
      <div {...styles.outer}>
        {this.renderInner(store)}
        {USE_FAKE_CURSOR && <FakeTouchCursor />}
      </div>
    );
  }

  renderInner(store: Store) {
    const { phoneDims, storeIndex } = this.state;
    if (store instanceof LoginStore) {
      return (
        <SlideDown
          noAnimate={store.didAutoLogin}
          top={<LoginPage store={store} />}
        />
      );
    }
    if (store instanceof ColumnStore) {
      return (
        <SlideDown
          noAnimate={store.didAutoLogin}
          bottom={
            <CompositePage
              {...phoneDims}
              target={Target.Machine}
              top={<ColumnTop />}
              bottom={<ColumnBottom store={store} />}
              column={store.column}
              storeIndex={storeIndex}
            />
          }
          focusBottom
        />
      );
    }
    if (store instanceof RatingStore) {
      return (
        <SlideDown
          noAnimate={store.didAutoLogin}
          bottom={
            <CompositePage
              {...phoneDims}
              target={Target.Square}
              top={<RatingTop />}
              bottom={<div />}
              column={store.column}
              storeIndex={storeIndex}
              ratingStore={store}
            />
          }
          focusBottom
        />
      );
    }
    return unreachable(store);
  }
}

export default App;
