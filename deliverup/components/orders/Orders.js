// ================== IMPORT REACT MODULES & ENVIRONMENT VARIABLES ====================
import React, { Component } from "react";
import { Content } from "native-base";
import { TabView, TabBar } from "react-native-tab-view";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================

//CLIENT COMPONENTS
import CurrentOrders from "./ClientOrders/CurrentOrders";
import CompletedOrders from "./ClientOrders/CompletedOrders";

//DELIVERER COMPONENTS
import DeliveredOrders from "./DelivererOrders/DeliveredOrders";
import InDelivery from "./DelivererOrders/InDelivery";

// STYLE SCRIPT
import Styles from "./../../Style";

// ================== ORDERS CLASS COMPONENT ====================
export default class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: "first", title: "En cours" },
        { key: "second", title: "Historique" },
      ],
    };
  }

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

  render() {
    if (this.props.deliverer === false) {
      return (
        <Content>
          <TabView
            navigationState={this.state}
            renderScene={() => null}
            renderTabBar={this._renderTabBar}
            onIndexChange={this._handleIndexChange}
          />
          {this.state.index === 0 && (
            <CurrentOrders
              userId={this.props.userId}
              socket={this.props.socket}
              token={this.props.token}
            />
          )}
          {this.state.index === 1 && (
            <CompletedOrders
              userId={this.props.userId}
              token={this.props.token}
            />
          )}
        </Content>
      );
    } else {
      return (
        <Content>
          <TabView
            navigationState={this.state}
            renderScene={() => null}
            renderTabBar={this._renderTabBar}
            onIndexChange={this._handleIndexChange}
          />
          {this.state.index === 0 && (
            <InDelivery
              userId={this.props.userId}
              socket={this.props.socket}
              token={this.props.token}
            />
          )}
          {this.state.index === 1 && (
            <DeliveredOrders
              userId={this.props.userId}
              token={this.props.token}
            />
          )}
        </Content>
      );
    }
  }
}
