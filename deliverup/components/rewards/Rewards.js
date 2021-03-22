// ================== IMPORT REACT NATIVE MODULES ====================
import * as React from "react";
import { ImageBackground, View, Modal, TouchableOpacity } from "react-native";
import {
  Content,
  Card,
  CardItem,
  Text,
  Left,
  Right,
  Body,
  Thumbnail,
  Title,
} from "native-base";
import { Tooltip, Icon } from "react-native-elements";
import { URL_API } from "../../env";
import * as axios from "axios";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import Styles from "./../../Style";

// ================== VARIABLES DECLARATION ====================
const wallpaper = require("../../assets/background.jpg");

// ================== REWARDS CLASS COMPONENT ====================
export default class Rewards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      userGifts: false,
    };
  }

  componentDidMount = async () => {
    await axios.get(`${URL_API}/api/user/gifts`).then((res) => {
      if (res.data.length > 0) {
        this.setState({ userGifts: res.data });
      }
    });
  };

  render() {
    return (
      <ImageBackground source={wallpaper} style={Styles.image}>
        <Content>
          <Separator />
          <Title style={Styles.titleStyle}>Récompenses</Title>
          <Separator />
          <Body style={Styles.dashboardBodyStyle}>
            <Card transparent style={Styles.dashBoardCard}>
              <CardItem header style={Styles.cardItemHeaderStyle}>
                <Text style={Styles.textBoldAndUpperCase}>
                  Votre solde points
                </Text>
              </CardItem>
              <CardItem style={Styles.cardItem}>
                <Thumbnail
                  source={{
                    uri:
                      "https://cdn4.iconfinder.com/data/icons/online-casinos/512/Bonus-512.png",
                  }}
                />
                <Text style={Styles.textStyle}>
                  {this.props.userPoint} points
                </Text>
              </CardItem>
            </Card>
            <Separator />
            <Card transparent style={Styles.dashBoardCard}>
              <CardItem header style={Styles.cardItemHeaderStyle}>
                <Text style={Styles.textBoldAndUpperCase}>
                  Liste de cadeaux
                </Text>
              </CardItem>
              {this.state.userGifts !== false ? (
                this.state.userGifts.map((data, index) => (
                  <Tooltip
                    key={index}
                    height={200}
                    width={300}
                    backgroundColor={"#001932"}
                    popover={
                      <View
                        style={{
                          alignItems: "center",
                        }}
                      >
                        <Title>{data.gifts[0].name}</Title>
                        <Text style={Styles.textStyle}>
                          En stock : {data.gifts[0].quantity}
                        </Text>
                        <Text style={Styles.textStyle}>
                          {" "}
                          coût: {data.gifts[0].pointNeeded} points
                        </Text>
                        <Separator />
                        <Title>Description</Title>
                        <Text style={Styles.textStyle}>
                          {" "}
                          {data.gifts[0].description}
                        </Text>
                      </View>
                    }
                  >
                    <CardItem style={Styles.cardItem}>
                      {data.gifts.map((data, index) => (
                        <Left key={index}>
                          <Thumbnail
                            square
                            source={{
                              uri: data.picture,
                            }}
                            style={Styles.thumbnailWithRadius}
                          />
                          <View style={{ marginLeft: 50 }}>
                            <Text style={Styles.textStyle}>{data.name}</Text>
                          </View>
                          <Right>
                            <Icon
                              name="gesture-tap"
                              type="material-community"
                              size={50}
                              color="orange"
                            />
                          </Right>
                        </Left>
                      ))}
                    </CardItem>
                  </Tooltip>
                ))
              ) : (
                <CardItem style={Styles.cardItem}>
                  <Left>
                    <Thumbnail
                      square
                      source={{
                        uri:
                          "https://cdn4.iconfinder.com/data/icons/new-year-christmas-nativity-xmas-noel-yule/192/.svg-512.png",
                      }}
                    />
                    <View style={{ marginLeft: 10 }}>
                      <Text style={Styles.textStyle}>
                        Aucuns cadeaux pour l'instant...
                      </Text>
                    </View>
                  </Left>
                </CardItem>
              )}
            </Card>
          </Body>
        </Content>
      </ImageBackground>
    );
  }
}

// ================== STYLE COMPONENT ====================
const Separator = () => <View style={{ marginVertical: 8 }} />;
