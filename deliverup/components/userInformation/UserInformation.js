// ================== IMPORT REACT MODULES & ENVIRONMENT VARIABLES ====================
import React, { Component } from "react";
import { ImageBackground, Image, Alert, TouchableOpacity } from "react-native";
import {
  View,
  Text,
  Title,
  Icon,
  Content,
  Switch,
  Right,
  Left,
  Card,
  CardItem,
  Thumbnail,
} from "native-base";
import { Tooltip } from "react-native-elements";
import * as axios from "axios";
import { Actions } from "react-native-router-flux";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { URL_API, URL_MEDIA } from "../../env";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import LoaderView from "../../components/LoaderView";
import Styles from "./../../Style";

// ================== VARIABLES DECLARATION ====================
const wallpaper = require("../../assets/background.jpg");

// ================== USER INFORMATION CLASS COMPONENT ====================
export default class UserInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      switchNotifValue: true,
      image: `${URL_MEDIA}/picture/user/${this.props.profilPicture}`,
    };
  }

  componentDidMount = async () => {
    this.setState({
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      address: this.props.address,
      email: this.props.email,
      like: this.props.like,
      loading: false,
    });
  };

  createPickImageAlert = () =>
    Alert.alert(
      "Modifier votre image",
      "",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Prendre une photo",
          onPress: () => this.takeImage(),
        },
        {
          text: "Sélectionner une photo",
          onPress: () => this.pickImage(),
        },
      ],
      { cancelable: false }
    );

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

  // Methods to get Images from Library
  pickImage = async () => {
    // make sure that we have the permission
    const hasPermission = await this.askForLibraryPermission();
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
      if (!image.cancelled) {
        let response = await fetch(`${URL_MEDIA}/userPicture`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          // send our base64 string as POST request
          body: JSON.stringify({
            imgsource: image.base64,
            userId: this.props.userId,
            profilPicture: this.props.profilPicture,
          }),
        });
        let data = await response.json();
        await axios.patch(
          `${URL_API}/api/user/update/${this.props.userId}`,
          data
        );
        this.props.updateInfo();
      }
    }
  };

  // Methods to get Image from camera
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
      if (!image.cancelled) {
        let response = await fetch(`${URL_MEDIA}/userPicture`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          // send our base64 string as POST request
          body: JSON.stringify({
            imgsource: image.base64,
            userId: this.props.userId,
            profilPicture: this.props.profilPicture,
          }),
        });
        let data = await response.json();
        await axios.patch(
          `${URL_API}/api/user/update/${this.props.userId}`,
          data
        );
        this.props.updateInfo();
      }
    }
  };

  showLike = () => {
    if (this.props.deliverer === true) {
      return (
        <View style={Styles.MainViewProfile}>
          <View style={Styles.customViewFirstRowLike}></View>
          <View style={Styles.customViewSecondRowLike}>
            <Title style={Styles.titleProfileStyle}>Mon Profil</Title>
          </View>
          <View style={Styles.customViewThirdRowLike}>
            <Tooltip
              height={100}
              backgroundColor={"#001932"}
              popover={
                <Text style={Styles.textStyle}>
                  Vos livraisons ont été aimées {this.state.like} fois !{" "}
                </Text>
              }
            >
              <Thumbnail
                small
                source={{
                  uri: `https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/heart-512.png`,
                }}
              />
            </Tooltip>
            <Text style={Styles.titleProfileLike}>{this.state.like}</Text>
          </View>
        </View>
      );
    } else {
      return <Title style={Styles.titleStyle}>Mon Profil</Title>;
    }
  };

  render() {
    return this.state.loading === false ? (
      <ImageBackground source={wallpaper} style={Styles.image}>
        <Content>
          <Separator />
          {this.showLike()}
          <View>
            <View style={Styles.pictureContainer}>
              <View style={Styles.backgroundContainer}>
                <Image
                  source={{ uri: this.state.image }}
                  resizeMode="cover"
                  style={Styles.backdropContainer}
                />
              </View>
              <View style={Styles.overlayContainer}>
                <TouchableOpacity onPress={() => this.createPickImageAlert()}>
                  <Text style={Styles.headlineContainer}>
                    <Icon
                      active
                      name="camera"
                      type="FontAwesome"
                      style={Styles.logoStyleContainer}
                    />
                    Modifier
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Separator />
            {/* Personnal informations */}
            <Card transparent style={Styles.profilCardStyle}>
              <CardItem header style={Styles.cardItemHeaderStyle}>
                <Text style={Styles.textBoldAndUpperCase}>
                  Informations Personnelles
                </Text>
              </CardItem>
              <CardItem style={Styles.cardItemProfile}>
                <Text style={Styles.textBold}>Nom de famille : </Text>
                <Text style={Styles.textStyle}>{this.state.lastName}</Text>
              </CardItem>
              <CardItem bordered style={Styles.cardItemProfile}>
                <Text style={Styles.textBold}>Prénom : </Text>
                <Text style={Styles.textStyle}>{this.state.firstName}</Text>
              </CardItem>
            </Card>
            <Separator />
            {/* Adress */}
            <Card transparent style={Styles.profilCardStyle}>
              <CardItem header style={Styles.cardItemHeaderStyle}>
                <Text style={Styles.textBoldAndUpperCase}>Adresse postale</Text>
              </CardItem>
              <CardItem style={Styles.cardItemProfile}>
                <Text style={Styles.textStyle}>
                  {this.state.address.number} {this.state.address.street}{" "}
                  {this.state.address.zipcode} {this.state.address.city}
                </Text>
              </CardItem>
              <CardItem
                button
                style={Styles.cardItemFooterProfile}
                onPress={() => Actions.UpdateAdress()}
              >
                <Text style={Styles.validateProfil}>Modifier l'adresse</Text>
              </CardItem>
            </Card>
            <Separator />
            {/* Identifiers */}
            <Card transparent style={Styles.profilCardStyle}>
              <CardItem header style={Styles.cardItemHeaderStyle}>
                <Text style={Styles.textBoldAndUpperCase}>
                  Identifiants personnels
                </Text>
              </CardItem>
              <CardItem style={Styles.cardItemProfile}>
                <Text style={Styles.textBold}>E-mail : </Text>
                <Text style={Styles.textStyle}>{this.state.email}</Text>
              </CardItem>
              <CardItem style={Styles.cardItemProfile}>
                <Text style={Styles.textBold}>Mot de passe :</Text>
                <Text style={Styles.textStyle}> **********</Text>
              </CardItem>
              <CardItem
                button
                onPress={() => Actions.UpdateInformations()}
                style={Styles.cardItemFooterProfile}
              >
                <Text style={Styles.validateProfil}>
                  Modifier les identifiants
                </Text>
              </CardItem>
            </Card>
          </View>
          <Separator />
          {/* Points */}
          <Card transparent style={Styles.profilCardStyle}>
            <CardItem header style={Styles.cardItemHeaderStyle}>
              <Text style={Styles.textBoldAndUpperCase}>
                Récompenses livreur
              </Text>
            </CardItem>
            <CardItem style={Styles.cardItemProfile}>
              <Left>
                <Tooltip
                  height={150}
                  width={200}
                  backgroundColor={"#001932"}
                  popover={
                    <Text style={Styles.textStyle}>
                      Pour echanger vos {this.props.userPoint} points, ça se
                      passe juste en dessous !!{" "}
                    </Text>
                  }
                >
                  <Thumbnail
                    source={{
                      uri: `https://cdn4.iconfinder.com/data/icons/online-casinos/512/Bonus-512.png`,
                    }}
                  />
                </Tooltip>
                <Text style={Styles.textStyle}>Mes points :</Text>
              </Left>
              <Right>
                <Text style={Styles.textStyle}>{this.props.userPoint}</Text>
              </Right>
            </CardItem>
            <CardItem
              button
              style={Styles.cardItemProfile}
              onPress={() => Actions.Rewards()}
            >
              <Left>
                <Thumbnail
                  source={{
                    uri: `https://cdn4.iconfinder.com/data/icons/new-year-christmas-nativity-xmas-noel-yule/192/.svg-512.png`,
                  }}
                />
                <Text style={Styles.textStyle}>Echanger mes points</Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" style={Styles.arrowStyle} />
              </Right>
            </CardItem>
          </Card>
          <Separator />
          {/* Settings */}
          <Card transparent style={Styles.profilCardStyle}>
            <CardItem header style={Styles.cardItemHeaderStyle}>
              <Text style={Styles.textBoldAndUpperCase}>Preferences</Text>
            </CardItem>
            <CardItem style={Styles.cardItemProfile}>
              <Left>
                <Thumbnail
                  style={
                    this.state.switchNotifValue !== false
                      ? Styles.colorThumbnail
                      : Styles.colorThumbnailOff
                  }
                  source={{
                    uri: `https://cdn0.iconfinder.com/data/icons/user-interface-198/64/bell-notification-interface-ui-512.png`,
                  }}
                />
              </Left>
              <Text style={Styles.textStyle}>
                Notifications{" "}
                {this.state.switchNotifValue !== false
                  ? "activées"
                  : "désactivées"}
              </Text>
              <Right>
                <Switch
                  onValueChange={(switchNotifValue) =>
                    this.setState({ switchNotifValue })
                  }
                  value={this.state.switchNotifValue}
                  trackColor={{ true: "orange", false: "silver" }}
                  thumbColor={
                    this.state.switchNotifValue ? "orange" : "lightgray"
                  }
                />
              </Right>
            </CardItem>
          </Card>
          <Separator />
        </Content>
      </ImageBackground>
    ) : (
      <LoaderView />
    );
  }
}

// ================== STYLE COMPONENT ====================
const Separator = () => <View style={{ marginVertical: 8 }} />;
