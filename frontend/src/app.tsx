import * as React from "react";
import { Store, LoginStore, ColumnStore, RatingStore } from "./store";

interface State {
  store: Store;
}

class App extends React.Component<{}, State> {
  state: State = { store: new LoginStore(this.onUpdate) };

  private onUpdate(store: Store) {
    this.setState({ store });
  }

  render() {
    const { store } = this.state;
    if (store instanceof LoginStore) {
      return <div>Login</div>;
    }
    if (store instanceof ColumnStore) {
      return <div>Column</div>;
    }
    if (store instanceof RatingStore) {
      return <div>Rating</div>;
    }
    return unreachable(store);
  }
}

function unreachable(x: never): never {
  throw new Error("unreachable");
}

export default App;
