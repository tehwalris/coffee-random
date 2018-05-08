import * as React from "react";
import { Store, LoginStore, ColumnStore, RatingStore } from "./store";
import LoginPage from "./pages/login";
import ColumnPage from "./pages/column";
import RatingPage from "./pages/rating";

interface State {
  store: Store;
}

class App extends React.Component<{}, State> {
  private onUpdate = (store: Store) => {
    this.setState({ store });
  };

  state: State = { store: new LoginStore(this.onUpdate) };

  render() {
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
}

function unreachable(x: never): never {
  throw new Error("unreachable");
}

export default App;
