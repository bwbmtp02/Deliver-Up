import React from "react";
import { View, StyleSheet } from "react-native";
import * as Font from "expo-font";

import { TabView, SceneMap, TabBar } from "react-native-tab-view";

import Loader from "./Loader";
import Login from "./Commercant/Connection/LoginCommercant";
import Register from "./Commercant/Connection/RegisterCommercant";
import OpenHeader from "./Header";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      index: 0,
      routes: [
        { key: "first", title: "Connexion" },
        { key: "second", title: "Inscription" },
      ],
    };
  }

  // First tab view
  FirstRoute = () => (
    <Login setConnection={(data) => this.props.setConnection(data)} />
  );

  // Second tab view
  SecondRoute = () => <Register />;

  // Change the index of the selected route
  _handleIndexChange = (index) => this.setState({ index });

  // Display the available views of the nav bar
  _renderTabBar = (props) => {
    return (
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: "orange" }}
        style={{ backgroundColor: "#3D0814" }}
      />
    );
  };

  // Jump on selected view
  _renderScene = SceneMap({
    first: this.FirstRoute,
    second: this.SecondRoute,
  });

  componentDidMount = async () => {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
    });
    this.setState({ loading: false });
  };

  render() {
    if (!this.state.loading) {
      return (
        <View style={{ flex: 1 }}>
          <OpenHeader />
          <TabView
            navigationState={this.state}
            renderScene={this._renderScene}
            renderTabBar={this._renderTabBar}
            onIndexChange={this._handleIndexChange}
          />
        </View>
      );
    } else {
      return <Loader />;
    }
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "orange",
    alignSelf: "center",
    marginTop: "10%",
    // borderWidth: 1,
    // borderColor: 'black'
  },
  logo: {
    alignSelf: "center",
    // borderWidth: 1,
    // borderColor: 'black'
  },
  text: {
    fontSize: 20,
    alignSelf: "center",
    marginTop: 10,
    color: "white",
    backgroundColor: "#000000a0",
    // borderWidth: 1,
    // borderColor: 'black'
  },
});

export default Home;
