// ================== IMPORT REACT NATIVE MODULES ====================
import React, { Component } from "react";
import { ImageBackground, View, Text } from "react-native";
import { Bars } from "react-native-loader";
import Styles from "./../Style";

// ================== VARIABLES DECLARATION ====================
const wallpaper = require("../assets/background.jpg");

// ================== LOADERVIEW CLASS COMPONENT ====================
export default class LoaderView extends Component {
  render() {
    return (
      <ImageBackground source={wallpaper} style={Styles.image}>
        <View style={Styles.containerLoaderView}>
          <View style={Styles.viewLoader}>
            <Bars size={50} color="orange" />
          </View>
          <Separator />
          <View style={Styles.viewLoader}>
            <Text style={Styles.textLoader}>
              Chargement, veuillez patienter...
            </Text>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

// ================== STYLE COMPONENT ====================
const Separator = () => <View style={{ marginVertical: 8 }} />;
