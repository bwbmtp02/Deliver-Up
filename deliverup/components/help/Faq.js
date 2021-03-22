// ================== IMPORT REACT NATIVE MODULES ====================
import React, { Component } from "react";
import { ImageBackground, View } from "react-native";
import { Text, Title, Thumbnail, Accordion } from "native-base";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import Styles from "./../../Style";
import faqArray from "./QuestionsAnswer";

// ================== VARIABLES DECLARATION ====================
const wallpaper = require("../../assets/background.jpg");

// ================== FAQ CLASS COMPONENT ====================
export default class Faq extends Component {
  constructor(props) {
    super(props);
  }

  _renderHeader(item, expanded) {
    return (
      <View style={Styles.faqView}>
        <Text style={Styles.textQuestionBold}> {item.title}</Text>
        {expanded ? (
          <Thumbnail
            small
            style={Styles.colorCreamThumbnail}
            source={{
              uri: `https://cdn3.iconfinder.com/data/icons/basicolor-arrows-checks/24/164_minus_delete_remove-512.png`,
            }}
          />
        ) : (
          <Thumbnail
            small
            style={Styles.colorCreamThumbnail}
            source={{
              uri: `https://cdn3.iconfinder.com/data/icons/basicolor-arrows-checks/24/163_plus_add_new-512.png`,
            }}
          />
        )}
      </View>
    );
  }

  _renderContent(item) {
    return <Text style={Styles.textItalic}>{item.content}</Text>;
  }

  render() {
    return (
      <ImageBackground source={wallpaper} style={Styles.image}>
        <Separator />
        <Title style={Styles.titleStyle}>Foire aux questions</Title>
        <Separator />
        <View>
          <Accordion
            dataArray={faqArray}
            animation={true}
            expanded={true}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
          />
        </View>
      </ImageBackground>
    );
  }
}

// ================== STYLE COMPONENT ====================
const Separator = () => <View style={{ marginVertical: 8 }} />;
