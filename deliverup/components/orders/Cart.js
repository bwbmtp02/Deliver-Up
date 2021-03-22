// ================== IMPORT REACT NATIVE MODULES ====================
import React from "react";
import {
  View,
  Text,
  ImageBackground,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  Button,
  Thumbnail,
  Content,
  Card,
  CardItem,
  Left,
  Right,
} from "native-base";
import { Actions } from "react-native-router-flux";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import Styles from "./../../Style";

// ================== VARIABLES DECLARATION ====================
const wallpaper = require("../../assets/background.jpg");

// ================== CART CLASS COMPONENT ====================
export default class Cart extends React.Component {
  constructor(props) {
    super(props);
  }

  alertClearCart = () => {
    Alert.alert(
      "Voulez vous vider votre panier ?",
      "En vidant votre panier vous n'aurez plus de caddie",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Confirmer",
          onPress: () => this.clearCart(),
        },
      ],
      { cancelable: true }
    );
  };

  clearCart = () => {
    this.props.clearCart();
  };

  removeProduct = (index) => {
    const updatedOrder = { ...this.props.getOrder };
    const updatedCart = [];
    this.props.getOrder.cart.map((product) => updatedCart.push(product));
    updatedCart.splice(index, 1);
    updatedOrder.cart = updatedCart;
    this.props.setOrder(updatedOrder);
  };

  render() {
    let total = 0;
    return (
      <ImageBackground source={wallpaper} style={Styles.cartImage}>
        <Content>
          <Separator />
          <Text style={Styles.titleStyle}>Panier</Text>
          <Separator />
          <Card transparent style={Styles.profilCardStyle}>
            <CardItem style={Styles.cardItemHeaderStyle}>
              <Left>
                <Text style={Styles.textBoldAndUpperCase}>
                  {this.props.getOrder.merchant.enterprise}
                </Text>
              </Left>
              <Right>
                <Button
                  block
                  onPress={() => this.alertClearCart()}
                  style={{
                    backgroundColor: "transparent",
                    borderColor: "red",
                    borderWidth: 1.5,
                  }}
                >
                  <Thumbnail
                    square
                    small
                    source={{
                      uri: `https://cdn1.iconfinder.com/data/icons/shopping-sale-actions-3/24/clear_cart_ecommerce_shopping-512.png`,
                    }}
                  />
                  <Text style={Styles.textBlackBold}>Vider le Panier</Text>
                </Button>
              </Right>
            </CardItem>
            {this.props.getOrder.cart.map(
              (product, key) => (
                (total += product.price * product.quantity),
                (
                  <CardItem key={key} style={Styles.orderCardItemStyle}>
                    <Left>
                      <Text style={Styles.textStyle}>{product.name}</Text>
                    </Left>
                    <Left>
                      <Text style={Styles.textStyle}>x{product.quantity}</Text>
                    </Left>
                    <Left>
                      <Text style={Styles.textStyle}>
                        {product.price}€{"   "}
                      </Text>
                    </Left>
                    <TouchableOpacity onPress={() => this.removeProduct(key)}>
                      <Thumbnail
                        small
                        style={Styles.colorThumbnailOff}
                        source={{
                          uri: `https://cdn0.iconfinder.com/data/icons/user-interface-198/64/remove-bin-interface-ui-512.png`,
                        }}
                      />
                    </TouchableOpacity>
                  </CardItem>
                )
              )
            )}
            <CardItem style={Styles.cardItem}>
              <Text style={Styles.textButtonStyle}>
                Total : {total.toFixed(2)}€
              </Text>
            </CardItem>
          </Card>
          <Separator />
          <Card transparent style={Styles.cardStyle}>
            <TouchableOpacity
              style={Styles.touchableAlign}
              onPress={() => Actions.Payment()}
            >
              <CardItem style={Styles.closeStyle}>
                <Text style={Styles.textButtonStyle}>Valider la commande</Text>
              </CardItem>
            </TouchableOpacity>
          </Card>
        </Content>
      </ImageBackground>
    );
  }
}

// ================== STYLE COMPONENT ====================
const Separator = () => <View style={{ marginVertical: 8 }} />;
