// ================== IMPORT REACT MODULES & ENVIRONMENT VARIABLES ====================
import React, { Component } from "react";
import { View, ImageBackground, Image, TouchableOpacity } from "react-native";
import { Text, Card, CardItem, Content } from "native-base";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import Styles from "./../../Style";

// ================== VARIABLES DECLARATION ====================
const wallpaper = require("../../assets/background.jpg");

// ================== PAYMENT CLASS COMPONENT ====================
export default class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
    };
  }

  componentDidMount = () => {
    let total = 0;
    this.props.getOrder.cart.map(
      (product) => (total += product.price * product.quantity)
    );
    this.setState({ total: total.toFixed(2) });
    this.props.socket.on("newOrderPosted", () => this.props.clearCart());
  };

  postOrder = async () => {
    const tab = [];
    this.props.getOrder.cart.map((product) => {
      const { available, picture, ...rest } = product;
      rest.idProduct = rest._id;
      delete rest._id;
      tab.push(rest);
    });
    const data = {
      state: "pendingMerchant",
      location: [
        this.props.user.location.coordinates[0],
        this.props.user.location.coordinates[1],
      ],
      user: {
        idUser: this.props.user._id,
        firstName: this.props.user.firstName,
        lastName: this.props.user.lastName,
        email: this.props.user.email,
        phone: this.props.user.phone,
        expoToken: this.props.user.expoToken,
        profilePicture: this.props.user.profilPicture,
        address: {
          number: this.props.user.address.number,
          street: this.props.user.address.street,
          zipcode: this.props.user.address.zipcode,
          city: this.props.user.address.city,
          location: this.props.user.location.coordinates,
        },
      },
      merchant: {
        idMerchant: this.props.getOrder.merchant._id,
        enterprise: this.props.getOrder.merchant.enterprise,
        category: this.props.getOrder.merchant.category,
        email: this.props.getOrder.merchant.email,
        phone: this.props.getOrder.merchant.phone,
        expoToken: this.props.getOrder.merchant.expoToken,
        profilePicture: this.props.getOrder.merchant.pictures,
        address: {
          number: this.props.getOrder.merchant.address.number,
          street: this.props.getOrder.merchant.address.street,
          zipcode: this.props.getOrder.merchant.address.zipcode,
          city: this.props.getOrder.merchant.address.city,
          location: this.props.getOrder.merchant.location.coordinates,
        },
      },
      products: tab,
      token: this.props.token,
    };
    this.props.socket.emit("setNewOrder", data);
  };

  render() {
    return (
      <ImageBackground source={wallpaper} style={Styles.image}>
        <Content>
          <Separator />
          <View>
            <Text style={Styles.titleStyle}>Mode de paiement</Text>
            <Separator />
            <Text style={Styles.PaymentText}>
              Facture {this.props.getOrder.merchant.enterprise}{" "}
            </Text>
            <Text style={Styles.textStyle}>Total: {this.state.total}€</Text>
            <Separator />
            <View style={Styles.paymentView}>
              <Image
                source={{
                  uri:
                    "https://cdn0.iconfinder.com/data/icons/credit-8/512/8_credit-256.png",
                }}
                style={Styles.paymentImage}
              />
              <Image
                source={{
                  uri:
                    "https://cdn0.iconfinder.com/data/icons/credit-8/512/4_credit-256.png",
                }}
                style={Styles.paymentImage}
              />
              <Image
                source={{
                  uri:
                    "https://cdn0.iconfinder.com/data/icons/credit-8/512/7_credit-256.png",
                }}
                style={Styles.paymentImage}
              />
            </View>
            <View style={Styles.paymentSmsView}>
              <Image
                source={{
                  uri:
                    "https://eus-www.sway-cdn.com/s/lVfqCH0KHq5sSLfQ/images/5t2bNgkOVgZbbj?quality=400&allowAnimation=false",
                }}
                style={Styles.paymentImage}
              />
              <Image
                source={{
                  uri:
                    "https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_padlock-256.png",
                }}
                style={Styles.paymentLockImage}
              />
            </View>
            <Card transparent style={Styles.cardStyle}>
              <TouchableOpacity
                style={Styles.touchableAlign}
                onPress={() => this.postOrder()}
              >
                <CardItem style={Styles.closeStyle}>
                  <Text style={Styles.textButtonStyle}>
                    Finaliser la commande
                  </Text>
                </CardItem>
              </TouchableOpacity>
            </Card>
          </View>
        </Content>
      </ImageBackground>
    );
  }
}

// ================== STYLE COMPONENT ====================
const Separator = () => <View style={{ marginVertical: 8 }} />;
