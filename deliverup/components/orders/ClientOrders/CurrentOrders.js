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
  Body,
} from "native-base";
import { BlurView } from "expo-blur";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import QRCode from "react-native-qrcode-svg";
import email from "react-native-email";
import * as axios from "axios";
import { URL_MEDIA, URL_API } from "../../../env";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import Styles from "./../../../Style";

// ================== VARIABLES DECLARATION ====================
const wallpaper = require("../../../assets/background.jpg");

// ================== CURRENT ORDERS CLASS COMPONENT ====================
export default class CurrentOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      QRCodeVisible: false,
      orders: [],
      blur: 0,
      socket: this.props.socket,
      userId: this.props.userId,
      token: this.props.token,
    };
  }

  componentDidMount = async () => {
    await axios
      .get(
        `${URL_API}/api/user/getOrder/${this.state.userId}/${this.state.token}`
      )
      .then((res) => {
        const tmpOrders = res.data;
        let doneOrders = [];
        tmpOrders.map((el) => {
          if (
            el.state === "pendingMerchant" ||
            el.state === "awaitingDelivery" ||
            el.state === "pendingDeliverer" ||
            el.state === "inProgress"
          ) {
            doneOrders.push(el);
          }
        });
        this.setState({ orders: doneOrders });
      });
    await this.state.socket.emit("storeClientInfo", {
      idClient: this.state.userId,
    });

    // Listen a modification on order
    await this.state.socket.on("orderUpdated", (data) => {
      const updatedOrders = [];
      this.state.orders.map((order) => updatedOrders.push(order));
      const index = updatedOrders.findIndex((order) => order._id === data._id);
      if (index === -1) {
        updatedOrders.push(data);
      } else {
        // updatedOrders[index] = data;
        if (data.state === "done") {
          updatedOrders.splice(index, 1);
          this.setState({ modalVisible: false, QRCodeVisible: false });
        } else {
          updatedOrders[index] = data;
        }
      }
      this.setState({ orders: updatedOrders });
    });
  };

  componentWillUnmount() {
    this.state.socket.off();
  }

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

  resizeQRCode = () => {
    this.setState({ QRCodeVisible: true, blur: 50 });
  };

  // Steps for progress bar
  whichStep = (step) => {
    switch (step) {
      case "pendingMerchant":
        return 0;

      case "pendingDeliverer":
        return 1;

      case "awaitingDelivery":
        return 2;

      case "inProgress":
        return 3;
    }
  };

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
                <CardItem footer style={Styles.orderCardItemStyle}>
                  <ProgressSteps
                    completedStepIconColor={"orange"}
                    completedCheckColor={"black"}
                    topOffset={10}
                    marginBottom={20}
                    completedProgressBarColor={"orange"}
                    activeStepIconBorderColor={"orange"}
                    labelFontSize={11}
                    activeLabelColor={"#fefee2"}
                    activeStep={this.whichStep(order.state)}
                    activeStepNumColor={"#fefee2"}
                    progressBarColor={"#fefee2"}
                    disabledStepIconColor={"#fefee2"}
                    disabledStepNumColor={"black"}
                  >
                    <ProgressStep
                      label={`En attente \n de validation`}
                      removeBtnRow={true}
                    />
                    <ProgressStep
                      label={`En attente \n de livreur`}
                      removeBtnRow={true}
                    />
                    <ProgressStep
                      label={`Récuperation de la commande`}
                      removeBtnRow={true}
                    />
                    <ProgressStep
                      label={`En cours \n de livraison`}
                      removeBtnRow={true}
                    />
                  </ProgressSteps>
                </CardItem>
              </Card>
            </TouchableOpacity>
          ))
        ) : (
          <CardItem style={Styles.orderCardItemStyle}>
            <Text style={Styles.textStyle}>Aucune commande en cours</Text>
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
                      <Body>
                        <TouchableOpacity onPress={() => this.resizeQRCode()}>
                          {this.state.orders[this.state.index].deliverer ? (
                            <QRCode
                              value={
                                this.state.orders[this.state.index]
                                  ? JSON.stringify({
                                      _id: this.state.orders[this.state.index]
                                        ._id,
                                      idUser: this.state.orders[
                                        this.state.index
                                      ].user.idUser,
                                      idMerchant: this.state.orders[
                                        this.state.index
                                      ].merchant.idMerchant,
                                      idDeliverer: this.state.orders[
                                        this.state.index
                                      ].deliverer.idDeliverer,
                                      step: "fromClient",
                                    })
                                  : ""
                              }
                              quietZone={8}
                              size={150}
                            />
                          ) : null}
                        </TouchableOpacity>
                      </Body>
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
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.QRCodeVisible}
          onRequestClose={() => this.setState({ QRCodeVisible: false })}
        >
          <TouchableOpacity
            onPress={() => this.setState({ QRCodeVisible: false })}
          >
            <BlurView intensity={125} tint="dark">
              <View style={Styles.blurView}>
                {this.state.orders[this.state.index] &&
                this.state.orders[this.state.index].deliverer ? (
                  <QRCode
                    value={
                      this.state.orders[this.state.index]
                        ? JSON.stringify({
                            _id: this.state.orders[this.state.index]._id,
                            idUser: this.state.orders[this.state.index].user
                              .idUser,
                            idMerchant: this.state.orders[this.state.index]
                              .merchant.idMerchant,
                            idDeliverer: this.state.orders[this.state.index]
                              .deliverer.idDeliverer,
                            step: "fromClient",
                          })
                        : ""
                    }
                    quietZone={8}
                    size={300}
                  />
                ) : null}
              </View>
            </BlurView>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}

// ================== STYLE COMPONENT ====================
const Separator = (props) => (
  <View style={{ marginVertical: props.value || 8 }} />
);
