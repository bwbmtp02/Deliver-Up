// ================== IMPORT REACT MODULES & ENVIRONMENT VARIABLES ====================
import React, { Component } from "react";
import { ImageBackground } from "react-native";
import { Container } from "native-base";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import OpenHeader from "../templates/OpenHeader";
import Register from "./register/Register";
import SignIn from "./signIn/SignIn";
import Styles from "./../../Style";

// ================== VARIABLES DECLARATION ====================
const wallpaper = require("../../assets/background.jpg");

// ================== CONNECTION CLASS COMPONENT ====================
export default class Connection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: "first", title: "Se connecter" },
        { key: "second", title: "S'enregistrer" },
      ],
    };
  }

  // First tab view
  FirstRoute = () => (
    <SignIn setConnection={(data) => this.props.setConnection(data)} />
  );

  // Second tab view
  SecondRoute = () => (
    <Register setConnection={(data) => this.props.setConnection(data)} />
  );

  // Change the index of the selected route
  _handleIndexChange = (index) => this.setState({ index });

  // Display the available views of the nav bar
  _renderTabBar = (props) => {
    return (
      <TabBar
        {...props}
        indicatorStyle={Styles.indicator}
        labelStyle={Styles.textStyle}
        style={Styles.tabBar}
      />
    );
  };

  // Jump on selected view
  _renderScene = SceneMap({
    first: this.FirstRoute,
    second: this.SecondRoute,
  });

  render() {
    return (
      <Container>
        <OpenHeader />
        <ImageBackground source={wallpaper} style={Styles.image}>
          <TabView
            navigationState={this.state}
            renderScene={this._renderScene}
            renderTabBar={this._renderTabBar}
            onIndexChange={this._handleIndexChange}
          />
        </ImageBackground>
      </Container>
    );
  }
}
