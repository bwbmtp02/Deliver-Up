import React from "react";

import { Drawer, Router, Scene, Stack, Tabs } from "react-native-router-flux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Font from "expo-font";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";

import Header from "./Header";
import Loader from "./Loader";

import Home from "./Home";
import InscriptionCommercant1 from "./Commercant/Connection/InscriptionCommercant1";

import HomeCommercant from "./Commercant/Home/HomeCommercant";
import QRCodeGenerator from "./QRCodeGenerator";
import ArticleAvailability from "./Commercant/Home/ArticleAvailability";
import SideBarCommercant from "./Commercant/Home/SideBarCommercant";
import HeaderCommercant from "./Commercant/Home/HeaderCommercant";
import HistoriqueCommercant from "./Commercant/Home/HistoriqueCommercant";
import SettingsCommercant from "./Commercant/Home/SettingsCommercant";

import ModifyAddress from "./Commercant/Home/ModifyAddress";
import ModifyIdentifiers from "./Commercant/Home/ModifyIdentifiers";
import ModifyBankCred from "./Commercant/Home/ModifyBankCred.jsx";

import axios from "react-native-axios";
import { URL_API } from "../env";
import Inscription from "./Commercant/Connection/Inscription";

export default class Routes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      hasToken: false,
      token: null,
      connected: false,
    };
  }

  componentDidMount = async () => {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      ...Ionicons.font,
    });
    const idToken = await AsyncStorage.getItem("id_token");
    // console.log(idToken)
    if (idToken) {
      await AsyncStorage.getItem("merchantId")
        .then((merchantId) => this.setState({ merchantId: merchantId }))
        .catch((err) =>
          console.error(
            `AsyncStorage error from Routes (get merchantId, componentdidmount): ${err.message}`
          )
        );
      await AsyncStorage.getItem("id_token")
        .then((token) => this.setState({ token: token }))
        .catch((err) =>
          console.error(
            `AsyncStorage error from Routes (get token, componentdidmount): ${err.message}`
          )
        );
      await axios
        .get(`${URL_API}/api/merchant/profile/id/${this.state.merchantId}`)
        .then((res) => this.setState({ merchant: res.data }))
        .catch((err) =>
          console.error(
            `Failed getting merchant infos for ${this.state.merchantId} : ${err}`
          )
        );

      await this.getExpoToken();

      await axios
        .patch(`${URL_API}/api/merchant/update/${this.state.merchantId}`, {
          expoToken: this.state.expoToken,
        })
        .catch((err) =>
          console.error(
            `Failed updating merchant expoToken for ${this.state.merchantId} : ${err}`
          )
        );
      this.setState({ loading: false, connected: true });
    } else {
      this.setState({ loading: false });
    }
  };

  getExpoToken = async () => {
    let expoToken;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Échec de l'obtention du Token pour la notification push !");
        return;
      }
      expoToken = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert(
        "Vous devez utiliser un appareil physique pour les notifications push"
      );
    }
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    this.setState({ expoToken: expoToken });
  };

  setConnection = async ({ merchantId, token }) => {
    // console.log(merchantId, token)
    await AsyncStorage.setItem("id_token", token).catch((err) =>
      console.error(
        `AsyncStorage error from Routes (set id_token): ${err.message}`
      )
    );
    await AsyncStorage.setItem("merchantId", merchantId).catch((err) =>
      console.error(
        `AsyncStorage error from Routes (set merchantId): ${err.message}`
      )
    );
    this.setState({
      merchantId: merchantId,
      token: token,
      connected: true,
    });
    // console.log(merchantId)
  };

  render() {
    if (this.state.loading) {
      return <Loader />;
    } else {
      return (
        <Router>
          <Scene key="root" hideNavBar>
            <Stack key="connection" hideNavBar>
              <Scene
                key="ConnectHome"
                component={Home}
                setConnection={(data) => this.setConnection(data)}
              />

              <Stack key="inscriptionCommercant" navBar={Header}>
                <Scene
                  key="inscription"
                  component={Inscription}
                  setConnection={(data) => this.setConnection(data)}
                />
                <Scene
                  key="inscriptionCommercant1"
                  component={InscriptionCommercant1}
                />
              </Stack>
            </Stack>
            <Scene key="generateQR" hideNavBar={false}>
              <Scene key="generateQR" component={QRCodeGenerator} />
            </Scene>
            <Drawer
              key="commercantHome"
              initial={this.state.connected}
              merchantId={this.state.merchantId}
              merchant={this.state.merchant}
              token={this.state.token}
              contentComponent={SideBarCommercant}
              navBar={HeaderCommercant}
            >
              {/* <Stack key="mainContainer"> */}
              <Scene key="Home" component={HomeCommercant} />
              <Scene
                key="HistoriqueCommercant"
                component={HistoriqueCommercant}
              />
              <Scene
                key="ArticleAvailability"
                component={ArticleAvailability}
              />
              <Scene key="SettingsCommercant" component={SettingsCommercant} />
              <Scene key="ModifyAddress" component={ModifyAddress} />
              <Scene key="ModifyIdentifiers" component={ModifyIdentifiers} />
              <Scene key="ModifyBankCred" component={ModifyBankCred} />
              {/* </Stack> */}
            </Drawer>
          </Scene>
        </Router>
      );
    }
  }
}
