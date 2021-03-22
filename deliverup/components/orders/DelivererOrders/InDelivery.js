// ================== IMPORT REACT MODULES & ENVIRONMENT VARIABLES ====================
import React, { Component } from "react";
import {
  View,
  Text,
  Modal,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import {
  Right,
  Left,
  Icon,
  Card,
  CardItem,
  Content,
  Thumbnail,
} from "native-base";
import * as axios from "axios";
import { Actions } from "react-native-router-flux";
import { URL_API, URL_MEDIA } from "../../../env";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import Styles from "./../../../Style";

// ================== VARIABLES DECLARATION ====================
const wallpaper = require("../../../assets/background.jpg");

// ================== IN DELIVERY ORDERS CLASS COMPONENT ====================
export default class InDelivery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      orders: [],
      blur: 0,
      socket: this.props.socket,
      userId: this.props.userId,
      token: this.props.token,
    };
  }

  componentDidMount = async () => {
    axios
      .get(
        `${URL_API}/api/user/getOrder/deliverer/${this.props.userId}/${this.props.token}`
      )
      .then(async (res) => {
        const tmpOrders = res.data;
        let doneOrders = [];
        await tmpOrders.map((el) => {
          if (el.state === "awaitingDelivery" || el.state === "inProgress") {
            doneOrders.push(el);
          }
        });
        this.setState({ orders: doneOrders });
      });

    this.state.socket.on("delivererUpdate", (data) => {
      const updatedOrders = [];
      this.state.orders.map((order) => updatedOrders.push(order));
      const index = updatedOrders.findIndex((order) => order._id === data._id);
      // this.setState({ orders: tmpOrders });
      if (index === -1) {
        updatedOrders.push(data);
      } else {
        if (data.state === "done") {
          updatedOrders.splice(index, 1);
        } else {
          updatedOrders[index] = data;
        }
      }
      this.setState({ orders: updatedOrders });
      Actions.Dashboard();
    });
  };

  componentWillUnmount() {
    this.state.socket.off();
  }

  render() {
    return (
      <View style={Styles.ordersView}>
        {this.state.orders[0] ? (
          this.state.orders.map((order, key) => (
            <TouchableOpacity
              key={key}
              style={Styles.makeBorder}
              onPress={() => {
                this.setState({ index: key, modalVisible: true });
              }}
            >
              <Card transparent>
                <CardItem style={Styles.orderCardItemStyle}>
                  <Left>
                    <Thumbnail
                      style={Styles.thumbnailWithRadius}
                      source={{
                        uri: `${URL_MEDIA}/picture/user/${order.user.profilePicture}`,
                      }}
                    />
                    <Text style={Styles.textStyle}>
                      &ensp; {order.user.firstName}
                    </Text>
                  </Left>
                  <Right>
                    <Icon name="arrow-forward" style={Styles.arrowStyle} />
                  </Right>
                </CardItem>
              </Card>
            </TouchableOpacity>
          ))
        ) : (
          <CardItem style={Styles.orderCardItemStyle}>
            <Text style={Styles.textStyle}>Aucune livraison en cours</Text>
          </CardItem>
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({ modalVisible: false })}
        >
          <View style={Styles.modalView}>
            <ImageBackground source={wallpaper} style={Styles.image}>
              <Content>
                <Separator />
                {this.state.orders.map((order, key) =>
                  key == this.state.index ? (
                    <View key={key}>
                      <Text style={Styles.titleContainer}>
                        {order.merchant.enterprise}
                      </Text>
                      <Separator />
                      <Card transparent>
                        <CardItem header style={Styles.cardItemHeaderStyle}>
                          <Text style={Styles.textBoldAndUpperCase}>
                            Informations de livraison
                          </Text>
                        </CardItem>
                        <CardItem style={Styles.cardItem}>
                          <Left>
                            <Text style={Styles.textBold}>Client livré : </Text>
                          </Left>
                          <Left>
                            <Text style={Styles.textStyle}>
                              {order.user.lastName} {order.user.firstName}
                            </Text>
                          </Left>
                        </CardItem>
                        <CardItem style={Styles.cardItem}>
                          <Left>
                            <Text style={Styles.textBold}>Adresse : </Text>
                          </Left>
                          <View style={Styles.inDeliveryModalView}>
                            <Text style={Styles.textStyle}>
                              {order.user.address.number}{" "}
                              {order.user.address.street} {`\n`}
                              {order.user.address.zipcode}{" "}
                              {order.user.address.city}
                            </Text>
                          </View>
                        </CardItem>
                      </Card>
                      <Separator />
                      {order.products.map((product, key) => (
                        <Card key={key} transparent>
                          <CardItem header style={Styles.cardItemHeaderStyle}>
                            <Text style={Styles.textBoldAndUpperCase}>
                              Produits en livraison
                            </Text>
                          </CardItem>
                          <CardItem style={Styles.cardItem}>
                            <Left>
                              <Text style={Styles.textStyle}>
                                {product.name}
                              </Text>
                            </Left>
                            <Right>
                              <Text style={Styles.textStyle}>
                                x{product.quantity}
                              </Text>
                            </Right>
                          </CardItem>
                        </Card>
                      ))}
                      <Separator />
                      <Card transparent style={Styles.cardStyle}>
                        <TouchableOpacity
                          style={Styles.touchableAlign}
                          onPress={() => this.setState({ modalVisible: false })}
                        >
                          <CardItem style={Styles.closeStyle}>
                            <Text style={Styles.textButtonStyle}>Fermer</Text>
                          </CardItem>
                        </TouchableOpacity>
                      </Card>
                    </View>
                  ) : null
                )}
              </Content>
            </ImageBackground>
          </View>
        </Modal>
      </View>
    );
  }
}

// ================== STYLE COMPONENT ====================
const Separator = () => <View style={{ marginVertical: 8 }} />;
