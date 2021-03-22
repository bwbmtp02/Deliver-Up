// ================== IMPORT REACT MODULES & ENVIRONMENT VARIABLES ====================
import React, { Component } from "react";
import { ImageBackground } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import UpdatePassword from "./UpdatePassword";
import UpdateMail from "./UpdateMail";
import Styles from "./../../Style";

// ================== VARIABLES DECLARATION ====================
const wallpaper = require("../../assets/background.jpg");

// ================== UPDATE INFORMATIONS CLASS COMPONENT ====================
export default class UpdateInformations extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        index: 0,
        routes: [
          { key: "first", title: "Mot de passe" },
          { key: "second", title: "Adresse mail" },
        ],
      });
  }

  // First tab view
  FirstRoute = () => <UpdatePassword userId={this.props.userId} />;

  // Second tab view
  SecondRoute = () => (
    <UpdateMail
      userId={this.props.userId}
      email={this.props.email}
      updateInfo={this.props.updateInfo}
    />
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
      <ImageBackground source={wallpaper} style={Styles.image}>
        <TabView
          navigationState={this.state}
          renderScene={this._renderScene}
          renderTabBar={this._renderTabBar}
          onIndexChange={this._handleIndexChange}
        />
      </ImageBackground>
    );
  }
}
