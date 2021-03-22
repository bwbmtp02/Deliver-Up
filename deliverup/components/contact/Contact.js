// ================== IMPORT REACT NATIVE MODULES ====================
import React, { Component } from "react";
import { ImageBackground, View, Linking } from "react-native";
import {
  Body,
  Text,
  Icon,
  Title,
  Card,
  CardItem,
  Left,
  Right,
  Thumbnail,
} from "native-base";
import email from "react-native-email";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import Styles from "./../../Style";

// ================== VARIABLES DECLARATION ====================
const wallpaper = require("../../assets/background.jpg");

// ================== CONTACT CLASS COMPONENT ====================
export default class Contact extends Component {
  constructor(props) {
    super(props);
  }

  Mailing() {
    const to = ["admin@admin.com"];
    email(to, {
      subject: "Support & Renseignements",
      body: " Que pouvons nous faire pour vous ? ",
    }).catch(console.error);
  }

  render() {
    return (
      <ImageBackground source={wallpaper} style={Styles.image}>
        <Separator />
        <Title style={Styles.titleStyle}>Service client</Title>
        <Separator />
        <Card transparent style={Styles.profilCardStyle}>
          {/* MAIL */}
          <CardItem header style={Styles.cardItemHeaderStyle}>
            <Text style={{ fontWeight: "bold" }}>CONTACT</Text>
          </CardItem>
          <CardItem
            button
            style={Styles.cardItem}
            onPress={() => this.Mailing()}
          >
            <Left>
              <Thumbnail
                style={Styles.colorCreamThumbnail}
                source={{
                  uri: `https://cdn1.iconfinder.com/data/icons/aami-flat-emails/64/email-02-512.png`,
                }}
              />
              <Text style={Styles.textStyle}>Par mail</Text>
            </Left>
            <Right>
              <Icon name="arrow-forward" style={Styles.arrowStyle} />
            </Right>
          </CardItem>
          {/* PHONE */}
          <CardItem
            button
            style={Styles.cardItem}
            onPress={() => Linking.openURL(`tel:0102030405`)}
          >
            <Left>
              <Thumbnail
                style={Styles.colorCreamThumbnail}
                source={{
                  uri: `https://cdn2.iconfinder.com/data/icons/customer-support-avatars/512/VR8-512.png`,
                }}
              />
              <Text style={Styles.textStyle}>Par téléphone</Text>
            </Left>
            <Right>
              <Icon name="arrow-forward" style={Styles.arrowStyle} />
            </Right>
          </CardItem>
        </Card>
      </ImageBackground>
    );
  }
}

// ================== STYLE COMPONENT ====================
const Separator = () => <View style={{ marginVertical: 8 }} />;
