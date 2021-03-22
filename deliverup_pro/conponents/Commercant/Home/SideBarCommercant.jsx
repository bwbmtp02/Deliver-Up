import React from "react";
import { Text, ImageBackground, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card, CardItem, Container, Content } from "native-base";

import { Actions } from "react-native-router-flux";

import axios from "react-native-axios";
import { URL_API, URL_MEDIA } from "../../../env";

import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export default class SideBarCommercant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = async () => {
    const merchantId = await AsyncStorage.getItem("merchantId");
    this.setState({ merchantId: merchantId });
    await axios
      .get(`${URL_API}/api/merchant/profile/id/${merchantId}`)
      .then((res) => {
        if (res.data.pictures === "") {
          this.setState({ merchantAvatar: "*" });
        } else {
          this.setState({ merchantAvatar: res.data.pictures });
        }
      });
  };

  handleLogOut = async () => {
    try {
      await AsyncStorage.removeItem("id_token");
      await AsyncStorage.removeItem("merchantId");
      Actions.connection();
    } catch (err) {
      console.error(`AsyncStorage error from SideBar: ${err.message} : ${err}`);
    }
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
        .catch((err) => console.error(err));
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
        .catch((err) => console.error(err));
    }
  };

  render() {
    return (
      <Container>
        <Content>
          <Card>
            <CardItem
              cardBody
              style={{ justifyContent: "center" }}
              button
              onPress={() => this.alertUpdateAvatar()}
            >
              <ImageBackground
                source={{
                  uri: `${URL_MEDIA}/picture/merchant/${this.state.merchantAvatar}`,
                }}
                style={{ width: 100, height: 100 }}
              >
                {/* <Text>{JSON.stringify(typeof this.state.merchantAvatar)}</Text> */}
              </ImageBackground>
            </CardItem>
          </Card>
          <Card>
            <CardItem button onPress={() => Actions.Home()}>
              <Text>Accueil</Text>
            </CardItem>
          </Card>
          <Card>
            <CardItem button onPress={() => Actions.ArticleAvailability()}>
              <Text>Liste des articles</Text>
            </CardItem>
          </Card>
          <Card>
            <CardItem button onPress={() => Actions.HistoriqueCommercant()}>
              <Text>Historique Commandes</Text>
            </CardItem>
          </Card>
          <Card>
            <CardItem button onPress={() => Actions.SettingsCommercant()}>
              <Text>Profil</Text>
            </CardItem>
          </Card>
          <Card>
            <CardItem button onPress={() => this.handleLogOut()}>
              <Text>Deconnexion</Text>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}
