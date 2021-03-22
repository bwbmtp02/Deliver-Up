import React, { Component } from "react";
import { View } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

import ModifyPassword from "./ModifyPassword";
import ModifyMail from "./ModifyMail";

export default class ModifyIdentifiers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: "first", title: "Mot de passe" },
        { key: "second", title: "Adresse mail" },
      ],
    };
  }

  // First tab view
  FirstRoute = () => <ModifyPassword merchantId={this.props.merchantId} />;

  // Second tab view
  SecondRoute = () => <ModifyMail merchantId={this.props.merchantId} />;

  // Change the index of the selected route
  _handleIndexChange = (index) => this.setState({ index });

  // Display the available views of the nav bar
  _renderTabBar = (props) => {
    return (
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: "orange" }}
        style={{ backgroundColor: "#17212b" }}
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
      <View style={{ flex: 1 }}>
        {/* <Content> */}

        <TabView
          navigationState={this.state}
          renderScene={this._renderScene}
          renderTabBar={this._renderTabBar}
          onIndexChange={this._handleIndexChange}
        />
        {/* <Text>salut mon pote</Text>
          
        <Text>test</Text> */}
        {/* </Content> */}
      </View>
    );
  }
}
