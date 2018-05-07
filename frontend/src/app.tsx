import * as React from "react";
import { random } from "lodash";

interface State {
  username: string;
  password: string;

  machineColumn: number;
}

class App extends React.Component<{}, State> {
  componentWillMount() {
    this.reset();
  }

  private reset() {
    this.setState({ machineColumn: random(1, 4) });
  }

  public render() {
    const { machineColumn } = this.state;
    return <div>{machineColumn}</div>;
  }
}

export default App;
