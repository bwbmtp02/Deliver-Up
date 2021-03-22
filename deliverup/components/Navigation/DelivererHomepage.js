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
import * as axios from "axios";
import { URL_API } from "./../../env";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import Orders from "../orders/Orders";
import Styles from "./../../Style";

// ================== DELIVERER DASHBOARD CLASS COMPONENT ====================
export default class DelivererHomepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCurrentOrder: false,
    };
  }

  componentDidMount = async () => {
    await axios
      .get(
        `${URL_API}/api/user/getOrder/deliverer/${this.props.userId}/${this.props.token}`
      )
      .then(async (res) => {
        const tmpOrders = res.data;
        await tmpOrders.map((el) => {
          if (el.state === "awaitingDelivery" || el.state === "inProgress") {
            this.setState({ hasCurrentOrder: true });
          }
        });
      });

    this.props.socket.on("delivererUpdate", async (data) => {
      if (data.state === "awaitingDelivery" || data.state === "inProgress") {
        this.setState({ hasCurrentOrder: true });
      }
      if (data.state === "done") {
        this.setState({ hasCurrentOrder: false });
      }
    });
  };

  render() {
    return (
      <View>
        {/* FIND A DELIVERY */}
        {this.state.hasCurrentOrder === false ? (
          <Card transparent style={Styles.cardStyle}>
            <CardItem header style={Styles.cardItemHeaderStyle}>
              <Text style={Styles.textBoldAndUpperCase}>
                Effectuer une livraison
              </Text>
            </CardItem>
            <CardItem
              button
              onPress={() => Actions.FindADelivery()}
              style={Styles.cardItem}
            >
              <Left>
                <Thumbnail
                  square
                  source={{
                    uri: `https://cdn1.iconfinder.com/data/icons/logistic-delivery-33/96/search_find_magnifier_scan_box_package_logistic_shipping_delivery-512.png`,
                  }}
                />
                <Text style={Styles.textStyle}>
                  Liste des livraisons disponible
                </Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" style={Styles.arrowStyle} />
              </Right>
            </CardItem>
          </Card>
        ) : null}
        {/* CURRENT DELIVERY */}
        <Separator />
        <Card style={Styles.cardStyle}>
          <CardItem header style={Styles.cardItemHeaderStyle}>
            <Text style={Styles.textBoldAndUpperCase}>Livraisons</Text>
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
