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
import email from "react-native-email";
import * as axios from "axios";
import { URL_API, URL_MEDIA } from "../../../env";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import Styles from "./../../../Style";

// ================== VARIABLES DECLARATION ====================
const wallpaper = require("../../../assets/background.jpg");

// ================== DELIVERED ORDERS CLASS COMPONENT ====================
export default class DeliveredOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      orders: [],
      blur: 0,
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
          if (el.state === "done" || el.state === "cancel") {
            doneOrders.push(el);
          }
        });
        this.setState({ orders: doneOrders });
      });
  };

  // Send mail to admin
  Mailing(orderNb) {
    const to = ["admin@admin.com"];
    email(to, {
      subject: "Commande numéro : " + orderNb,
      body:
        " Veuillez détailler le problème que vous rencontrez au sujet de la commande numéro :" +
        orderNb,
    }).catch(console.error);
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
            <Text style={Styles.textStyle}>
              Aucune livraison dans votre historique
            </Text>
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
                              Produits livrés
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
const Separator = (props) => <View style={{ marginVertical: 8 }} />;
