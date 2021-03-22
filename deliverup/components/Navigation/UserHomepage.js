// ================== IMPORT REACT NATIVE MODULES ====================
import React, { Component } from "react";
import { View } from "react-native";
import {
  Text,
  Icon,
  Card,
  CardItem,
  Left,
  Right,
  Thumbnail,
} from "native-base";
import { Actions } from "react-native-router-flux";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import Orders from "../orders/Orders";
import Styles from "./../../Style";

// ================== USER DASHBOARD CLASS COMPONENT ====================
export default class UserHomepage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        {/* FIND A SHOP */}
        <Card transparent style={Styles.cardStyle}>
          <CardItem header style={Styles.cardItemHeaderStyle}>
            <Text style={Styles.textBoldAndUpperCase}>Passer une commande</Text>
          </CardItem>
          <CardItem
            button
            bordered
            style={Styles.cardItem}
            onPress={() => Actions.ShopList()}
          >
            <Left>
              <Thumbnail
                source={{
                  uri: `https://cdn4.iconfinder.com/data/icons/business-and-finance-colorful-free-hand-drawn-set/100/shopping_cart-512.png`,
                }}
              />
              <Text style={Styles.textStyle}>
                Afficher la liste des boutiques
              </Text>
            </Left>
            <Right>
              <Icon name="arrow-forward" style={Styles.arrowStyle} />
            </Right>
          </CardItem>
          <CardItem
            button
            bordered
            style={Styles.cardItem}
            onPress={() => Actions.ClientLocation()}
          >
            <Left>
              <Thumbnail
                source={{
                  uri: `https://cdn1.iconfinder.com/data/icons/back-to-school-illustrathin/128/globe-earth-map-512.png`,
                }}
              />
              <Text style={Styles.textStyle}>
                Afficher les boutiques sur la carte
              </Text>
            </Left>
            <Right>
              <Icon name="arrow-forward" style={Styles.arrowStyle} />
            </Right>
          </CardItem>
        </Card>
        <Separator />
        {/* CURRENT ORDERS */}
        <Card style={Styles.cardStyle}>
          <CardItem header style={Styles.cardItemHeaderStyle}>
            <Text style={Styles.textBoldAndUpperCase}>Commandes</Text>
          </CardItem>
          <Orders
            userId={this.props.userId}
            socket={this.props.socket}
            token={this.props.token}
            deliverer={this.props.deliverer}
          />
        </Card>
        <Separator />
      </View>
    );
  }
}

// ================== STYLE COMPONENT ====================
const Separator = () => <View style={{ marginVertical: 8 }} />;
