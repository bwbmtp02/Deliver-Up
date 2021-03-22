import React, { Component } from "react";
import { StyleSheet, ImageBackground, Image, Alert, View } from "react-native";
import {
  Container,
  Spinner,
  Content,
  Title,
  Card,
  CardItem,
  Text,
  Icon,
  Left,
  Thumbnail,
  Right,
  Switch,
} from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";
import { URL_API, URL_MEDIA } from "../../../env";
import axios from "react-native-axios";

import { Actions } from "react-native-router-flux";

import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import Styles from "../../Styles";

export default class SettingsCommercant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      merchant: this.props.merchant,
      avatarLoading: true,
      merchantAvatar: "*",
      switchNotifValue: true,
    };
  }

  componentDidMount = async () => {
    const merchantId = this.props.merchantId;
    this.setState({ merchantId: merchantId });
    await axios
      .get(`${URL_API}/api/merchant/profile/id/${merchantId}`)
      .then((res) => {
        if (res.data.pictures !== "") {
          this.setState({
            merchantAvatar: res.data.pictures,
            avatarLoading: false,
          });
        }
      })
      .catch((err) =>
        console.error(`Cannot getting merchant picture : ${err}`)
      );
  };

  alertUpdateAvatar = () => {
    return Alert.alert(
      "Voulez vous changer de photo de commerce",
      "",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Sélectionner une photo",
          onPress: () => this.pickImage(),
        },
        {
          text: "Prendre une photo",
          onPress: () => this.takeImage(),
        },
      ],
      { cancelable: false }
    );
  };

  askForCameraPermission = async () => {
    const permissionResult = await Permissions.askAsync(Permissions.CAMERA);
    if (permissionResult.status !== "granted") {
      Alert.alert("Vous n'avez pas autorisé l'accès à l'appareil photo !", [
        { text: "ok" },
      ]);
      return false;
    }
    return true;
  };

  takeImage = async () => {
    // make sure that we have the permission
    const hasPermission = await this.askForCameraPermission();
    if (!hasPermission) {
      return;
    } else {
      let image = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 1,
        base64: true,
      });
      // make sure a image was taken:
      if (!image.cancelled);

      let response = await fetch(`${URL_MEDIA}/merchantPicture`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        // send our base64 string as POST request
        body: JSON.stringify({
          imgsource: image.base64,
          previousAvatar: this.state.merchantAvatar,
          merchantId: this.state.merchantId,
        }),
      });
      let data = await response.json();
      this.setState({
        merchantAvatar: data.merchantPicture,
      });
      await axios
        .patch(`${URL_API}/api/merchant/update/${this.state.merchantId}`, {
          pictures: data.merchantPicture,
        })
        .then((res) => console.log(res.data))
        .catch((err) =>
          console.error(`Error at updating picture (settings) : ${err}`)
        );
    }
  };

  askForLibraryPermission = async () => {
    const permissionResult = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    if (permissionResult.status !== "granted") {
      Alert.alert("Vous n'avez pas autorisé l'accès à vos photos !", [
        { text: "ok" },
      ]);
      return false;
    }
    return true;
  };

  pickImage = async () => {
    // make sure that we have the permission
    const hasPermission = await this.askForLibraryPermission();
    // console.log(hasPermission)
    if (!hasPermission) {
      return;
    } else {
      let image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 1,
        base64: true,
      });
      // make sure a image was taken:
      if (!image.cancelled);
      let response = await fetch(`${URL_MEDIA}/merchantPicture`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        // send our base64 string as POST request
        body: JSON.stringify({
          imgsource: image.base64,
          previousAvatar: this.state.merchantAvatar,
          merchantId: this.state.merchantId,
        }),
      });
      const data = await response.json();
      this.setState({
        merchantAvatar: data.merchantPicture,
      });
      await axios
        .patch(`${URL_API}/api/merchant/update/${this.state.merchantId}`, {
          pictures: data.merchantPicture,
        })
        .then((res) => console.log(res.data))
        .catch((err) =>
          console.error(`Error at updating picture (settings) : ${err}`)
        );
    }
  };

  render() {
    return (
      <Container>
        <View style={Styles.containerView}>
          <Content>
            <TouchableOpacity>
              <Title style={styles.titleStyle}>
                {this.state.merchant.enterprise}{" "}
                <Icon
                  active
                  name="pencil"
                  type="Entypo"
                  style={{ color: "lightgrey" }}
                />
              </Title>
            </TouchableOpacity>

            <Separator />
            <View>
              <View style={styles.container}>
                <View style={styles.backgroundContainer}>
                  {this.state.avatarLoading ? (
                    <Spinner />
                  ) : (
                    <Image
                      source={{
                        uri: `${URL_MEDIA}/picture/merchant/${this.state.merchantAvatar}`,
                      }}
                      resizeMode="cover"
                      style={styles.backdrop}
                    />
                  )}
                </View>
                <View style={styles.overlay}>
                  <TouchableOpacity onPress={() => this.alertUpdateAvatar()}>
                    <Text style={styles.headline}>
                      <Icon
                        active
                        name="camera"
                        type="FontAwesome"
                        style={styles.logoStyle}
                      />{" "}
                      Modifier{" "}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Separator />
              {/* Adress */}
              <Card style={styles.cardStyle}>
                <CardItem
                  header
                  style={{
                    alignSelf: "center",
                    width: "100%",
                    justifyContent: "center",
                    backgroundColor: "#fefee2",
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>ADRESSE</Text>
                </CardItem>
                <CardItem bordered style={styles.cardItemStyle}>
                  <Text style={styles.textStyle}>
                    {this.state.merchant.address.number}{" "}
                    {this.state.merchant.address.street}{" "}
                    {this.state.merchant.address.zipcode}{" "}
                    {this.state.merchant.address.city}
                  </Text>
                </CardItem>
                <CardItem
                  footer
                  button
                  style={styles.cardItemModifyStyle}
                  onPress={() => Actions.ModifyAddress()}
                >
                  <Text style={styles.modifyStyle}>Modifier l'adresse</Text>
                </CardItem>
              </Card>
              <Separator />
              {/* Identifiers */}
              <Card style={styles.cardStyle}>
                <CardItem
                  header
                  style={{
                    alignSelf: "center",
                    width: "100%",
                    justifyContent: "center",

                    backgroundColor: "#fefee2",
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>IDENTIFIANTS</Text>
                </CardItem>
                <CardItem bordered style={styles.cardItemStyle}>
                  <Text style={styles.textInfo}>E-mail : </Text>
                  <Text style={styles.textStyle}>
                    {this.state.merchant.email}
                  </Text>
                </CardItem>
                <CardItem bordered button style={styles.cardItemStyle}>
                  <Text style={styles.textInfo}>Mot de passe : </Text>
                  <Text style={styles.textStyle}> **********</Text>
                </CardItem>
                <CardItem
                  footer
                  button
                  onPress={() => Actions.ModifyIdentifiers()}
                  style={styles.cardItemModifyStyle}
                >
                  <Text style={styles.modifyStyle}>
                    Modifier les identifiants
                  </Text>
                </CardItem>
              </Card>
              <Separator />
              {/* Administratif */}
              <Card style={styles.cardStyle}>
                <CardItem
                  header
                  style={{
                    alignSelf: "center",
                    width: "100%",
                    justifyContent: "center",
                    backgroundColor: "#fefee2",
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>ADMINISTRATIF</Text>
                </CardItem>
                <CardItem
                  button
                  style={styles.cardItemModifyStyle}
                  onPress={() => Actions.ModifyBankCred({ index: 0 })}
                >
                  <Text style={styles.modifyStyle}>Modifier mon IBAN</Text>
                </CardItem>
                <CardItem
                  button
                  style={styles.cardItemModifyStyle}
                  onPress={() => Actions.ModifyBankCred({ index: 1 })}
                >
                  <Text style={styles.modifyStyle}>Modifier mon num SIRET</Text>
                </CardItem>
              </Card>
              <Separator />
              {/* Settings */}
              <Card style={styles.cardStyle}>
                <CardItem
                  header
                  style={{
                    alignSelf: "center",
                    width: "100%",
                    justifyContent: "center",
                    backgroundColor: "#fefee2",
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>PREFERENCES</Text>
                </CardItem>
                <CardItem style={styles.cardItemStyle}>
                  <Left>
                    <Thumbnail
                      source={
                        this.state.switchNotifValue !== false
                          ? {
                              uri: `https://cdn2.iconfinder.com/data/icons/basic-ui-elements-line-circle/512/_Alarm_bell_clock_notif_notification_notifications_ring-512.png`,
                            }
                          : {
                              uri: `https://nsa40.casimages.com/img/2021/02/04//210204052123699375.png`,
                            }
                      }
                    />
                  </Left>
                  <Text style={styles.textStyle}>NOTIFICATIONS</Text>
                  <Right>
                    <Switch
                      onValueChange={(switchNotifValue) =>
                        this.setState({ switchNotifValue })
                      }
                      value={this.state.switchNotifValue}
                      trackColor={{ true: "orange" }}
                      thumbColor={
                        this.state.switchNotifValue ? "#e8ac35" : "#f4f3f4"
                      }
                    />
                  </Right>
                </CardItem>
              </Card>
              <Separator />
            </View>
          </Content>
        </View>
      </Container>
    );
  }
}

const Separator = () => <View style={{ marginVertical: 8 }} />;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "cover",
  },
  listView: {
    width: "95%",
  },
  titleStyle: {
    color: "black",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    // backgroundColor: "#17212b",
  },
  cardStyle: {
    borderColor: "orange",
    borderWidth: 2,
    alignSelf: "center",
    width: "80%",
    backgroundColor: "#3D0814",
  },
  cardItemStyle: {
    backgroundColor: "#3D0814",
  },
  textInfo: {
    fontWeight: "bold",
    color: "white",
  },
  textStyle: {
    color: "white",
  },
  cardItemModifyStyle: {
    backgroundColor: "#3D0814",
    alignSelf: "center",
  },
  modifyStyle: {
    color: "white",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  // STYLE FOR IMAGE & ICON CHANGE IMAGE
  backgroundContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    flex: 1,
    alignItems: "center",
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  overlay: {
    opacity: 0.5,
    borderRadius: 20,
    backgroundColor: "#000000",
    marginTop: 155,
  },
  backdrop: {
    flex: 1,
    flexDirection: "column",
    // borderRadius: 100,
    borderColor: "orange",
    borderWidth: 1,
  },
  headline: {
    fontSize: 18,
    textAlign: "center",
    color: "white",
  },
  logoStyle: {
    color: "white",
    fontSize: 20,
  },
});
