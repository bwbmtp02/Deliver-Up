// ================== IMPORT REACT NATIVE MODULES ====================
import React, { Component } from "react";
import { ImageBackground, View, Alert, TouchableOpacity } from "react-native"; // React Native
import {
  Title,
  Content,
  Body,
  Text,
  Thumbnail,
  Card,
  CardItem,
  Icon,
  Right,
  Left,
} from "native-base"; // Module Native Base
import { Actions } from "react-native-router-flux";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import UserHomepage from "./Navigation/UserHomepage";
import DelivererHomepage from "./Navigation/DelivererHomepage";
import LoaderView from "./LoaderView";
import Styles from "./../Style";

// ================== VARIABLES DECLARATION ====================
const wallpaper = require("../assets/background.jpg");

// ================== DASHBOARD CLASS COMPONENT ====================
export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      deliverer: this.props.deliverer,
      token: this.props.token,
      userId: this.props.userId,
      socket: this.props.socket,
    };
  }

  // Alert when disconnect
  createDisconnectAlert = () =>
    Alert.alert(
      "Vous êtes en train de vous déconnecter !",
      "Voulez-vous réellement vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Ok",
          onPress: () => this.props.disconnect(),
        },
      ],
      { cancelable: false }
    );

  render() {
    if (this.state.loading === true) {
      return (
        <ImageBackground source={wallpaper} style={Styles.image}>
          <Content>
            <Separator />
            <Title style={Styles.titleStyle}>Tableau de bord</Title>
            <Body style={Styles.dashboardBodyStyle}>
              <Separator />
              {/* WHAT IS SHOW, DEPENDS ON YOUR STATUS */}
              {this.state.deliverer === false ? (
                <Card transparent style={Styles.dashBoardCard}>
                  <UserHomepage
                    userId={this.props.userId}
                    socket={this.props.socket}
                    token={this.props.token}
                    deliverer={this.props.deliverer}
                  />
                </Card>
              ) : (
                <Card transparent style={Styles.dashBoardCard}>
                  <DelivererHomepage
                    userId={this.props.userId}
                    socket={this.props.socket}
                    token={this.props.token}
                    deliverer={this.props.deliverer}
                  />
                </Card>
              )}
              {/* HELP & CONTACT */}
              <Card transparent style={Styles.dashBoardCard}>
                {/* CONTACT */}
                <CardItem header style={Styles.cardItemHeaderStyle}>
                  <Text style={Styles.textBoldAndUpperCase}>
                    Aide & Contact
                  </Text>
                </CardItem>
                <CardItem
                  button
                  style={Styles.cardItem}
                  onPress={() => Actions.Contact()}
                >
                  <Left>
                    <Thumbnail
                      style={Styles.colorCreamThumbnail}
                      source={{
                        uri: `https://cdn1.iconfinder.com/data/icons/aami-flat-emails/64/email-07-512.png`,
                      }}
                    />
                    <Text style={Styles.textStyle}>Service client</Text>
                  </Left>
                  <Right>
                    <Icon name="arrow-forward" style={Styles.arrowStyle} />
                  </Right>
                </CardItem>
                {/* QUESTIONS & ANSWER */}
                <CardItem
                  button
                  style={Styles.cardItem}
                  onPress={() => Actions.Faq()}
                >
                  <Left>
                    <Thumbnail
                      style={Styles.colorCreamThumbnail}
                      source={{
                        uri: `https://cdn4.iconfinder.com/data/icons/contact-us-set-1-1/64/x-10-3-512.png`,
                      }}
                    />
                    <Text style={Styles.textStyle}>Foire aux questions</Text>
                  </Left>
                  <Right>
                    <Icon name="arrow-forward" style={Styles.arrowStyle} />
                  </Right>
                </CardItem>
              </Card>
              <Separator />
              {/* WHAT DO YOU WANNA DO ? */}
              <Card transparent style={Styles.dashBoardCard}>
                <CardItem header style={Styles.cardItemHeaderStyle}>
                  <Text style={Styles.textBoldAndUpperCase}>Gestion</Text>
                </CardItem>
                <TouchableOpacity onPress={() => this.props.userChoice()}>
                  <CardItem style={Styles.cardItem}>
                    <Left>
                      <Thumbnail
                        style={Styles.colorCreamThumbnail}
                        source={{
                          uri: `https://cdn0.iconfinder.com/data/icons/business-management-3-9/128/1-09-512.png`,
                        }}
                      />
                      <Text style={Styles.textStyle}>
                        Choix du mode utilisateur
                      </Text>
                    </Left>
                  </CardItem>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.createDisconnectAlert()}>
                  <CardItem style={Styles.cardItem}>
                    <Left>
                      <Thumbnail
                        style={Styles.colorCreamThumbnail}
                        source={{
                          uri: `https://cdn4.iconfinder.com/data/icons/multimedia-234/60/shutdown__off__logout__power__switch-512.png`,
                        }}
                      />
                      <Text style={Styles.textStyle}>Déconnexion</Text>
                    </Left>
                  </CardItem>
                </TouchableOpacity>
              </Card>
            </Body>
            <Separator />
          </Content>
        </ImageBackground>
      );
    } else {
      return <LoaderView />;
    }
  }
}

// ================== STYLE COMPONENT ====================
const Separator = () => <View style={{ marginVertical: 8 }} />;
