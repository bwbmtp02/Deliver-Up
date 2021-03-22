// ================== IMPORT REACT MODULES & ENVIRONMENT VARIABLES ====================
import React, { Component } from "react";
import { View, ImageBackground, TouchableHighlight } from "react-native";
import {
  Title,
  Content,
  Text,
  Icon,
  Card,
  CardItem,
  Left,
  Right,
  Thumbnail,
} from "native-base";
import { Actions } from "react-native-router-flux";
import { Avatar } from "react-native-elements";
import { URL_MEDIA, URL_API } from "../../env";
import * as axios from "axios";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import Styles from "./../../Style";

// ================== VARIABLES DECLARATION ====================
const wallpaper = require("../../assets/background.jpg");

// ================== LOBBY CLASS COMPONENT ====================
export default class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentOrders: [],
      userId: this.props.userId,
      socket: this.props.socket,
    };
  }

  componentDidMount = async () => {
    if (this.props.deliverer === false) {
      await axios
        .get(
          `${URL_API}/api/user/getOrder/${this.props.userId}/${this.props.token}`
        )
        .then((res) => {
          const tmpOrders = res.data;
          let doneOrders = [];
          tmpOrders.map((el) => {
            if (el.state === "awaitingDelivery" || el.state === "inProgress") {
              doneOrders.push(el);
            }
          });
          this.setState({ currentOrders: doneOrders });
        });
      await this.props.socket.on("orderUpdated", (data) => {
        const updatedOrders = [];
        this.state.currentOrders.map((order) => updatedOrders.push(order));
        const index = updatedOrders.findIndex(
          (order) => order._id === data._id
        );
        if (index === -1) {
          if (data.state !== "done") {
            updatedOrders.push(data);
          }
        } else {
          if (data.state === "done") {
            updatedOrders.splice(index, 1);
          } else {
            updatedOrders[index] = data;
          }
        }
        this.setState({ currentOrders: updatedOrders });
      });
    } else {
      await axios
        .get(
          `${URL_API}/api/user/getOrder/deliverer/${this.props.userId}/${this.props.token}`
        )
        .then((res) => {
          const tmpOrders = res.data;
          let doneOrders = [];
          tmpOrders.map((el) => {
            if (el.state === "awaitingDelivery" || el.state === "inProgress") {
              doneOrders.push(el);
            }
          });
          this.setState({ currentOrders: doneOrders });
        });
      this.props.socket.on("delivererUpdate", async (data) => {
        const updatedOrders = [];
        this.state.currentOrders.map((order) => updatedOrders.push(order));
        const index = updatedOrders.findIndex(
          (order) => order._id === data._id
        );
        if (index === -1) {
          if (data.state !== "done") {
            updatedOrders.push(data);
          }
        } else {
          if (data.state === "done") {
            updatedOrders.splice(index, 1);
          } else {
            updatedOrders[index] = data;
          }
        }
        this.setState({ currentOrders: updatedOrders });
      });
    }
  };

  render = () => {
    return (
      <ImageBackground source={wallpaper} style={Styles.image}>
        <Content>
          <Separator />
          <Title style={Styles.titleStyle}>Messagerie</Title>
          <Separator />
          {this.state.currentOrders[0] ? (
            this.state.currentOrders.map((order, key) => (
              <TouchableHighlight
                key={key}
                onPress={() =>
                  Actions.Chat({
                    order: order,
                    userId: this.props.userId,
                  })
                }
              >
                <Card style={Styles.cardStyle}>
                  <CardItem style={Styles.cardItemHeaderStyle}>
                    <Thumbnail
                      square
                      small
                      source={{
                        uri: `https://cdn0.iconfinder.com/data/icons/filled-artisto-shopping/48/Seller-512.png`,
                      }}
                    />
                    <Text style={Styles.textBlackBold}>
                      {" "}
                      {order.merchant.enterprise}
                    </Text>
                  </CardItem>
                  <CardItem style={Styles.cardItem}>
                    <Left>
                      <Avatar
                        avatarStyle={Styles.thumbnailWithRadius}
                        rounded
                        size="medium"
                        source={
                          this.props.userId === order.user.idUser
                            ? {
                                uri: `${URL_MEDIA}/picture/user/${order.deliverer.profilePicture}`,
                              }
                            : {
                                uri: `${URL_MEDIA}/picture/user/${order.user.profilePicture}`,
                              }
                        }
                      >
                        <Avatar.Accessory style={Styles.indicator} />
                      </Avatar>
                      <Text style={Styles.textStyle}>
                        &ensp;{" "}
                        {this.props.userId === order.user.idUser
                          ? order.deliverer.firstName
                          : order.user.firstName}
                      </Text>
                    </Left>
                    <Right>
                      <Icon name="arrow-forward" style={Styles.arrowStyle} />
                    </Right>
                  </CardItem>
                </Card>
              </TouchableHighlight>
            ))
          ) : (
            <Card style={Styles.cardLobby}>
              <CardItem style={Styles.cardItemLobby}>
                <Thumbnail
                  square
                  large
                  source={{
                    uri: `https://cdn4.iconfinder.com/data/icons/lifestyle-23/512/chat-talk-messages-lifestyle-512.png`,
                  }}
                />
                <Text style={Styles.textBlackBold}>
                  {" "}
                  Aucune discussion en cours{" "}
                </Text>
              </CardItem>
            </Card>
          )}
        </Content>
      </ImageBackground>
    );
  };
}

// ================== STYLE COMPONENT ====================
const Separator = () => <View style={{ marginVertical: 8 }} />;
