// ================== IMPORT REACT MODULES & ENVIRONMENT VARIABLES ====================
import React, { Component } from "react";
import {
  View,
  Text,
  Modal,
  ImageBackground,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  Button,
  Right,
  Left,
  Icon,
  Card,
  CardItem,
  Title,
  Thumbnail,
} from "native-base";
import * as axios from "axios";
import { Actions } from "react-native-router-flux";
import { URL_API, URL_MEDIA } from "../../../env";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import Styles from "./../../../Style";

// ================== VARIABLES DECLARATION ====================
const wallpaper = require("../../../assets/background.jpg");

// ================== IN DELIVERY CLASS COMPONENT ====================
export default class FindADelivery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      ordersWaitingForDeliverer: [],
      socket: this.props.socket,
    };
  }

  componentDidMount = async () => {
    await axios
      .get(
        `${URL_API}/api/user/orders/${this.props.user.location.coordinates[0]}/${this.props.user.location.coordinates[1]}/2`
      )
      .then((response) => {
        this.setState({ ordersWaitingForDeliverer: response.data });
      });

    this.state.socket.on("error", (truc) =>
      console.log(truc, "error from inDelivery")
    );
  };

  validateAlert = (data) => {
    Alert.alert(
      "Vous êtes en train d'accepter la livraison de cette commande !",
      "Voulez-vous réellement accepter ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Ok",
          onPress: () => {
            this.validateOrder(data);
            Actions.Dashboard();
          },
        },
      ],
      { cancelable: false }
    );
  };

  validateOrder = async (selectedOrder) => {
    const data = {
      state: "awaitingDelivery",
      deliverer: {
        idDeliverer: this.props.user._id,
        firstName: this.props.user.firstName,
        lastName: this.props.user.lastName,
        email: this.props.user.email,
        phone: this.props.user.phone,
        expoToken: this.props.user.expoToken,
        profilePicture: this.props.user.profilPicture,
      },
      token: this.props.token,
      orderId: selectedOrder._id,
    };
    this.state.socket.emit("delivererTakesOrder", data);
  };

  render() {
    return (
      <ImageBackground source={wallpaper} style={Styles.image}>
        <Separator />
        <Text style style={Styles.titleStyle}>
          Liste des commandes
        </Text>
        <Separator />
        {this.state.ordersWaitingForDeliverer.length > 0 ? (
          this.state.ordersWaitingForDeliverer.map((data, key) => (
            <Card key={key} transparent>
              <CardItem
                button
                style={Styles.orderCardItemStyle}
                onPress={() => {
                  this.setState({ index: key });
                  this.setState({ modalVisible: true });
                }}
              >
                <Left>
                  <Thumbnail
                    source={{
                      uri: `${URL_MEDIA}/picture/user/${data.user.profilePicture}`,
                    }}
                  />
                  <Text style={Styles.textStyle}>
                    &ensp; {data.user.firstName} a commandé chez{" "}
                    <Text style={Styles.textBold}>
                      {data.merchant.enterprise}
                    </Text>
                  </Text>
                </Left>
                <Right>
                  <Icon name="arrow-forward" style={Styles.arrowStyle} />
                </Right>
              </CardItem>
            </Card>
          ))
        ) : (
          <Card style={Styles.cardLobby}>
            <CardItem style={Styles.cardItemLobby}>
              <Thumbnail
                square
                large
                source={{
                  uri: `https://cdn4.iconfinder.com/data/icons/unigrid-phantom-basic-vol-1/60/019_040_hourglass_sand_loading_waiting_clock_time_date_2-512.png`,
                }}
              />
              <Text style={Styles.textBlackBold}>
                {" "}
                Aucune livraison disponible{" "}
              </Text>
            </CardItem>
          </Card>
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({ modalVisible: false })}
        >
          <ImageBackground source={wallpaper} style={Styles.image}>
            <Separator />
            {this.state.ordersWaitingForDeliverer.map((data, key) =>
              key == this.state.index ? (
                <View key={key}>
                  <Separator />
                  <Card style={Styles.cardFindStyle}>
                    <CardItem header style={Styles.cardItemHeaderStyle}>
                      <Text style={Styles.titleInformationContainer}>
                        Informations de commande
                      </Text>
                    </CardItem>
                    <CardItem style={Styles.orderCardItemStyle}>
                      <Thumbnail
                        source={{
                          uri: `${URL_MEDIA}/picture/user/${data.user.profilePicture}`,
                        }}
                        style={{
                          borderColor: "orange",
                          borderWidth: 0.5,
                        }}
                      />
                      <Text style={Styles.titleContainer}>
                        {"  "}
                        {data.user.firstName} {data.user.lastName}
                      </Text>
                    </CardItem>
                    <CardItem style={Styles.orderCardItemStyle}>
                      <Text style={Styles.textBold}>Adresse :</Text>
                      <Text style={Styles.textStyle}>
                        {" "}
                        {data.user.address.number} {data.user.address.street}{" "}
                        {data.user.address.zipcode} {data.user.address.city}
                      </Text>
                    </CardItem>
                    <CardItem style={Styles.orderCardItemStyle}>
                      <Thumbnail
                        source={{
                          uri: `${URL_MEDIA}/picture/merchant/${data.merchant.profilePicture}`,
                        }}
                        style={{
                          borderColor: "orange",
                          borderWidth: 0.5,
                        }}
                      />
                      <Text style={Styles.titleContainer}>
                        {"  "}
                        {data.merchant.enterprise}
                      </Text>
                    </CardItem>
                    <CardItem style={Styles.orderCardItemStyle}>
                      <Text style={Styles.textStyle}>
                        <Text style={Styles.textBold}>Adresse :</Text>{" "}
                        {data.merchant.address.number}{" "}
                        {data.merchant.address.street}
                        {"\n"}
                        {data.merchant.address.zipcode}{" "}
                        {data.merchant.address.city}
                      </Text>
                    </CardItem>
                    <CardItem style={Styles.orderCardItemStyle}>
                      <Thumbnail
                        square
                        source={{
                          uri: `https://cdn3.iconfinder.com/data/icons/gardening-108/340/food_gardening_garden_vegetable_organic_harvest_basket-512.png`,
                        }}
                      />
                      <Text style={Styles.titleContainer}>
                        {"  "}
                        Produits
                      </Text>
                    </CardItem>
                    {data.products.map((data, key) =>
                      data.quantity != 0 ? (
                        <CardItem key={key} style={Styles.orderCardItemStyle}>
                          <Text style={Styles.textStyle}>- {data.name} </Text>
                          <Text style={Styles.textXItems}>
                            {" "}
                            x{data.quantity}
                          </Text>
                        </CardItem>
                      ) : null
                    )}
                    <CardItem style={Styles.orderCardItemStyle}>
                      <Button
                        style={Styles.customFindButton}
                        rounded
                        onPress={() => {
                          this.setState({ modalVisible: false });
                          Actions.OrderMap({ test: data });
                        }}
                      >
                        <Thumbnail
                          style={Styles.findMapImage}
                          source={{
                            uri: `https://cdn0.iconfinder.com/data/icons/travel-volume-1-2/256/20-512.png`,
                          }}
                        />
                        <Text style={Styles.textButtonFind}>
                          Afficher les informations sur la carte
                        </Text>
                      </Button>
                    </CardItem>
                    <CardItem style={Styles.orderCardItemStyle}>
                      <Button
                        style={Styles.customFindButton}
                        rounded
                        onPress={() => this.validateAlert(data)}
                      >
                        <Text style={Styles.textButtonFind}>
                          Accepter livraison
                        </Text>
                      </Button>
                    </CardItem>
                  </Card>
                  <Separator />
                </View>
              ) : null
            )}
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
          </ImageBackground>
        </Modal>
      </ImageBackground>
    );
  }
}

// ================== STYLE COMPONENT ====================
const Separator = () => <View style={{ marginVertical: 8 }} />;
