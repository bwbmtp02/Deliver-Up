// ================== IMPORT REACT MODULES & ENVIRONMENT VARIABLES ====================
import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import {
  Button,
  Right,
  Left,
  Body,
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

// ================== COMPLETED ORDERS CLASS COMPONENT ====================
export default class CompletedOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      QRCodeVisible: false,
      orders: [],
      blur: 0,
      userId: this.props.userId,
      token: this.props.token,
    };
  }

  async componentDidMount() {
    await axios
      .get(
        `${URL_API}/api/user/getOrder/${this.state.userId}/${this.state.token}`
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
  }

  // Send mail to admin
  Mailing(orderNb) {
    const to = ["admin@admin.com"];
    email(to, {
      subject: "Commande numéro : " + orderNb,
      body:
        " Veuillez détailler le problème que vous rencontrez au sujet de la " +
        orderNb,
    }).catch(console.error);
  }

  render() {
    let total = 0;
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
                        uri: `${URL_MEDIA}/picture/merchant/${order.merchant.profilePicture}`,
                      }}
                    />
                    <Text style={Styles.textStyle}>
                      &ensp; {order.merchant.enterprise}
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
              Aucune commande dans votre historique
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
                      {order.products.map(
                        (product, key) => (
                          (total += product.price * product.quantity),
                          (
                            <Card key={key}>
                              <CardItem style={Styles.cardItem}>
                                <Left>
                                  <Text style={Styles.textStyle}>
                                    {product.name}
                                  </Text>
                                </Left>
                                <Left>
                                  <Text style={Styles.textStyle}>
                                    x{product.quantity}
                                  </Text>
                                </Left>
                                <Right>
                                  <Text style={Styles.textStyle}>
                                    {product.price}€
                                  </Text>
                                </Right>
                              </CardItem>
                              <CardItem style={Styles.cardItem}>
                                <Text style={Styles.textButtonStyle}>
                                  Total : {total}€
                                </Text>
                              </CardItem>
                            </Card>
                          )
                        )
                      )}
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
                      <Separator />
                      <TouchableOpacity
                        block
                        onPress={() => this.Mailing(order._id)}
                      >
                        <Card transparent style={Styles.cardStyle}>
                          <CardItem style={Styles.cardItemStyle}>
                            <Thumbnail
                              small
                              style={Styles.colorThumbnail}
                              source={{
                                uri: `https://cdn0.iconfinder.com/data/icons/user-interface-198/64/question-faq-interface-ui-512.png`,
                              }}
                            />
                            <Text style={Styles.askQuestion}>
                              &ensp;Signaler un problème concernant la commande
                            </Text>
                          </CardItem>
                        </Card>
                      </TouchableOpacity>
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
const Separator = (props) => (
  <View style={{ marginVertical: props.value || 8 }} />
);
