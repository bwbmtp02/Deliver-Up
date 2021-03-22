// ================== IMPORT REACT NATIVE MODULES ====================
import React, { Component } from "react";
import { ImageBackground, View, TouchableOpacity } from "react-native"; // React Native
import { Title, Text, Card, CardItem, Thumbnail } from "native-base"; // Module Native Base

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import Styles from "./../Style";

// ================== VARIABLES DECLARATION ====================
const wallpaper = require("../assets/background.jpg");

// ================== HOMEPAGE CLASS COMPONENT ====================
export default class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      deliverer: this.props.deliverer,
    };
  }

  render() {
    return (
      <ImageBackground source={wallpaper} style={Styles.image}>
        <Separator />
        <Title style={Styles.titleStyle}>Bienvenue</Title>
        <Separator />
        <View>
          <Card transparent style={Styles.cardStyle}>
            <CardItem header style={Styles.cardItemHeaderStyle}>
              <Text style={Styles.textBoldAndUpperCase}>
                Que souhaitez vous faire ?
              </Text>
            </CardItem>
          </Card>
          <Separator />
          <Card transparent>
            <CardItem style={Styles.cardItemStyle}>
              <View style={Styles.homepageLeftView}>
                <TouchableOpacity
                  style={Styles.touchableAlign}
                  onPress={() =>
                    this.state.deliverer === true
                      ? this.setState({ deliverer: false })
                      : null
                  }
                >
                  <Thumbnail
                    square
                    style={Styles.homepageThumbnail}
                    source={{
                      uri: `https://cdn4.iconfinder.com/data/icons/supermarket-50/512/Grocery-Paper_Bag-Shopping-Supermarket-512.png`,
                    }}
                  />
                  <Text
                    style={
                      this.state.deliverer === true
                        ? Styles.textStyle
                        : Styles.textStyleSelected
                    }
                  >
                    Je souhaite commander
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={Styles.homepageRightView}>
                <TouchableOpacity
                  style={Styles.touchableAlign}
                  onPress={() =>
                    this.state.deliverer === false
                      ? this.setState({ deliverer: true })
                      : null
                  }
                >
                  <Thumbnail
                    square
                    style={Styles.homepageThumbnail}
                    source={{
                      uri: `https://cdn0.iconfinder.com/data/icons/buy-food-online-in-colour/60/food_delivery_online-128-512.png`,
                    }}
                  />
                  <Text
                    style={
                      this.state.deliverer === false
                        ? Styles.textStyle
                        : Styles.textStyleSelected
                    }
                  >
                    Je souhaite {`\n`} livrer
                  </Text>
                </TouchableOpacity>
              </View>
            </CardItem>
          </Card>
          <Separator />
          <Card transparent>
            <CardItem style={Styles.cardItemChoiceStyle}>
              <Text style={Styles.textStyle}>
                Vous desirez {"\n"}
                <Text style={Styles.textChoiceStyle}>
                  {this.state.deliverer === false ? "COMMANDER" : "LIVRER"}
                </Text>
              </Text>
            </CardItem>
            <Separator />
          </Card>
          <Card transparent style={Styles.cardStyle}>
            <TouchableOpacity
              style={Styles.touchableAlign}
              onPress={async () =>
                this.props.switchDelivererState(this.state.deliverer)
              }
            >
              <CardItem style={Styles.validateStyle}>
                <Text style={Styles.textButtonStyle}>Valider</Text>
              </CardItem>
            </TouchableOpacity>
          </Card>
        </View>
      </ImageBackground>
    );
  }
}

// ================== STYLE COMPONENT ====================
const Separator = () => <View style={{ marginVertical: 8 }} />;
