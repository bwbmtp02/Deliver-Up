// ================== IMPORT REACT NATIVE MODULES ====================
import React, { Component } from "react";
import { Text, TouchableOpacity } from "react-native";
import { Button, Footer, FooterTab, Thumbnail } from "native-base";
import { Actions } from "react-native-router-flux";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import Styles from "./../../Style";

// ================== CUSTOM DELIVERER TABBAR CLASS COMPONENT ====================
export default class CustomDelivererTabBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Footer style={Styles.footerHeight}>
        <FooterTab style={Styles.footerStyle}>
          <Button style={Styles.cardItemStyle} disabled>
            <TouchableOpacity onPress={() => Actions.Dashboard()}>
              <Thumbnail
                small
                style={Styles.colorThumbnail}
                source={{
                  uri: `https://cdn0.iconfinder.com/data/icons/user-interface-198/64/menu-home-interface-ui-512.png`,
                }}
              />
              <Text style={Styles.textStyle}>Accueil</Text>
            </TouchableOpacity>
          </Button>
          <Button style={Styles.cardItemStyle} disabled>
            <TouchableOpacity onPress={() => Actions.QrReader()}>
              <Thumbnail
                small
                style={Styles.colorThumbnail}
                source={{
                  uri: `https://cdn0.iconfinder.com/data/icons/user-interface-198/64/zoom-shot-interface-ui-512.png`,
                }}
              />
              <Text style={Styles.textStyle}>Scanner</Text>
            </TouchableOpacity>
          </Button>
          <Button style={Styles.cardItemStyle} disabled>
            <TouchableOpacity onPress={() => Actions.Lobby()}>
              <Thumbnail
                small
                style={Styles.colorThumbnail}
                source={{
                  uri: `https://cdn0.iconfinder.com/data/icons/user-interface-198/64/chat-announce-interface-ui-512.png`,
                }}
              />
              <Text style={Styles.textStyle}>Messagerie</Text>
            </TouchableOpacity>
          </Button>
          <Button style={Styles.cardItemStyle} disabled>
            <TouchableOpacity onPress={() => Actions.UserInformation()}>
              <Thumbnail
                small
                style={Styles.colorThumbnail}
                source={{
                  uri: `https://cdn0.iconfinder.com/data/icons/user-interface-198/64/user-login-interface-ui-512.png`,
                }}
              />
              <Text style={Styles.textStyle}>Profil</Text>
            </TouchableOpacity>
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}
