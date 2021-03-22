// ================== IMPORT REACT NATIVE MODULES ====================
import React from "react";
import * as Font from "expo-font";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import Routing from "./components/Routing";
import LoaderView from "./components/LoaderView";

// ================== APP CLASS COMPONENT ====================
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount = async () => {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
    });
    this.setState({ loading: false });
  };

  render() {
    if (!this.state.loading) {
      return <Routing />;
    } else {
      return <LoaderView />;
    }
  }
}
