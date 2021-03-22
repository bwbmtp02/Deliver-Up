// ================== IMPORT REACT MODULES & ENVIRONMENT VARIABLES ====================
import React from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { Router, Scene, Actions } from "react-native-router-flux";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import * as axios from "axios";
import { io } from "socket.io-client";
import { URL_API, URL_ORDERS } from "../env";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import ShopList from "./orders/ShopList";
import Cart from "./orders/Cart";
import Homepage from "./Homepage";
import Dashboard from "./Dashboard";
import Contact from "./contact/Contact";
import Faq from "./help/Faq";
import Rewards from "./rewards/Rewards";
import UserInformation from "./userInformation/UserInformation";
import Payment from "./payment/Payment";
import FindADelivery from "./orders/DelivererOrders/FindADelivery";
import QrReader from "./qrReader/QRreader";
import UpdateInformations from "./userInformation/UpdateInformations";
import UpdateAdress from "./userInformation/UpdateAdress";
import UpdatePassword from "./userInformation/UpdatePassword";
import UpdateMail from "./userInformation/UpdateMail";
import Chat from "./chat/Chat";
import Lobby from "./chat/Lobby";
import ClientLocation from "./geolocation/Geolocation";
import OrderMap from "./geolocation/OrderMapClass";
import Register from "./connection/register/Register";
import Connection from "./connection/Connection";
import CustomTabBar from "./templates/CustomTabBar";
import CustomDelivererTabBar from "./templates/CustomDelivererTabBar";
import OpenHeader from "./templates/OpenHeader";
import LoaderView from "./LoaderView";

// ================== ROUTING CLASS COMPONENT ====================
export default class Routing extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      connected: false,
      hasToken: false,
      token: null,
      userMadeChoice: false,
      deliverer: false,
      currentOrders: [],
      isWrapped: true,
      order: null, // référence à ShopList (panier)
      socket: io(URL_ORDERS),
    };
  }

  componentDidMount = async () => {
    try {
      // Check localStorage to find user token, then update state
      if (await AsyncStorage.getItem("@id_token")) {
        await AsyncStorage.getItem("@id_token").then((idToken) => {
          this.setState({ token: idToken });
        });
        await AsyncStorage.getItem("@userId").then((userId) => {
          this.setState({ userId: userId });
        });
        // Get user informations
        await axios
          .get(`${URL_API}/api/user/profile/id/${this.state.userId}`)
          .then((res) =>
            this.setState({
              user: res.data,
              deliverer: res.data.deliverer,
              lastName: res.data.lastName,
              firstName: res.data.firstName,
              address: res.data.address,
              email: res.data.email,
              loading: true,
              expoToken: res.data.expoToken,
              profilPicture: res.data.profilPicture,
              like: res.data.like,
              userPoint: res.data.userPoint,
              connected: true,
            })
          );
        // Get User current orders
        if (this.state.deliverer == false) {
          await axios
            .get(`${URL_API}/api/user/order/${this.state.userId}`)
            .then((res) => {
              if (res.data.error) {
                this.setState({ currentOrders: [] });
              } else {
                this.setState({ currentOrders: res.data });
              }
            });
          if (this.state.currentOrders.length !== 0) {
            this.setState({
              userMadeChoice: !this.state.userMadeChoice,
              hasCurrentOrder: true,
            });
          }
        } else {
          await axios
            .get(`${URL_API}/api/user/order/deliverer/${this.state.userId}`)
            .then((res) => {
              if (res.data.error) {
                this.setState({ currentOrders: [] });
              } else {
                this.setState({ currentOrders: [res.data] });
              }
            });
          if (this.state.currentOrders.length !== 0) {
            this.setState({
              userMadeChoice: !this.state.userMadeChoice,
              hasCurrentOrder: true,
            });
          }
        }
      }
      if (await AsyncStorage.getItem("@order")) {
        await AsyncStorage.getItem("@order").then((order) =>
          this.setState({ order: JSON.parse(order) })
        );
      }
    } catch (err) {
      console.error(`Error from Routing componentDidMount \n: ${err.message}`);
    }
    this.setState({ loading: false });
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

  switchDelivererState = async (value) => {
    this.setState({
      deliverer: value,
      userMadeChoice: !this.state.userMadeChoice,
    });
    await axios.patch(`${URL_API}/api/user/update/${this.state.userId}`, {
      deliverer: value,
    });
  };

  userChoice = async () => {
    if (this.state.deliverer === false) {
      await axios
        .get(`${URL_API}/api/user/order/${this.state.userId}`)
        .then((res) => {
          if (res.data.length != 0) {
            Alert.alert(
              "Impossible de changer de mode utilisateur",
              `Vous avez des commandes en cours`,
              [
                {
                  text: "Ok",
                },
              ],
              { cancelable: true }
            );
          } else {
            this.setState({ userMadeChoice: !this.state.userMadeChoice });
          }
        });
    } else {
      await axios
        .get(`${URL_API}/api/user/order/deliverer/${this.state.userId}`)
        .then((res) => {
          if (res.data.error != "Order doesn't exist !") {
            Alert.alert(
              "Impossible de changer de mode utilisateur",
              `Vous avez prit en charge une commande`,
              [
                {
                  text: "Ok",
                },
              ],
              { cancelable: true }
            );
          } else {
            this.setState({ userMadeChoice: !this.state.userMadeChoice });
          }
        });
    }
  };

  setConnection = async ({ userId, token }) => {
    try {
      await AsyncStorage.setItem("@id_token", token);
      await AsyncStorage.setItem("@userId", userId);
    } catch (err) {
      console.error(`AsyncStorage error: ${err.message}`);
    }
    try {
      await this.getExpoToken();
      await axios.patch(`${URL_API}/api/user/update/${userId}`, {
        expoToken: this.state.expoToken,
      });
    } catch (err) {
      console.error(`Message: ${err.message}`);
    }

    try {
      await axios.get(`${URL_API}/api/user/profile/id/${userId}`).then((res) =>
        this.setState({
          user: res.data,
          deliverer: res.data.deliverer,
          lastName: res.data.lastName,
          firstName: res.data.firstName,
          address: res.data.address,
          email: res.data.email,
          userId: userId,
          token: token,
          profilPicture: res.data.profilPicture,
          like: res.data.like,
          userPoint: res.data.userPoint,
          connected: true,
        })
      );
      if (this.state.deliverer === false) {
        await axios.get(`${URL_API}/api/user/order/${userId}`).then((res) => {
          if (res.data.error) {
            this.setState({ currentOrders: [] });
          } else {
            this.setState({ currentOrders: res.data });
          }
        });
        if (this.state.currentOrders.length !== 0) {
          this.setState({
            userMadeChoice: !this.state.userMadeChoice,
            hasCurrentOrder: true,
          });
        }
      } else {
        await axios
          .get(`${URL_API}/api/user/order/deliverer/${userId}`)
          .then((res) => {
            if (res.data.error) {
              this.setState({ currentOrders: [] });
            } else {
              this.setState({ currentOrders: [res.data] });
            }
          });
        if (this.state.currentOrders.length !== 0) {
          this.setState({
            userMadeChoice: !this.state.userMadeChoice,
            hasCurrentOrder: true,
          });
        }
      }
    } catch (err) {
      console.error(`Message: ${err.message}`);
    }
  };

  disconnect = async () => {
    try {
      await AsyncStorage.removeItem("@id_token");
      await AsyncStorage.removeItem("@userId");
      await AsyncStorage.removeItem("@order");
      this.state.socket.disconnect();
      this.setState({ connected: false, userMadeChoice: false });
    } catch (err) {
      console.error(`AsyncStorage error: ${err.message}`);
    }
  };

  updateInfo = async () => {
    await axios
      .get(`${URL_API}/api/user/profile/id/${this.state.userId}`)
      .then((res) =>
        this.setState({
          user: res.data,
          deliverer: res.data.deliverer,
          lastName: res.data.lastName,
          firstName: res.data.firstName,
          address: res.data.address,
          email: res.data.email,
          profilPicture: res.data.profilPicture,
          like: res.data.like,
          userPoint: res.data.userPoint,
        })
      );
    Actions.UserInformation();
  };

  handleOrder = async (order) => {
    if (order.cart[0]) {
      await AsyncStorage.setItem("@order", JSON.stringify(order));
      this.setState({
        order: order, // order gets the order object from shoplist with handleOrder method
      });
    } else {
      await AsyncStorage.removeItem("@order");
      this.setState({ order: null });
    }
  };

  clearCart = async () => {
    await AsyncStorage.removeItem("@order");
    this.setState({ order: null });
    this.updateCurrentOrder();
  };

  updateCurrentOrder = async () => {
    await axios
      .get(`${URL_API}/api/user/order/${this.state.userId}`)
      .then((res) => {
        if (res.data.error) {
          this.setState({ currentOrders: [] });
        } else {
          this.setState({ currentOrders: res.data });
        }
      });
  };

  render() {
    if (this.state.loading === false) {
      return (
        <Router>
          <Scene key="ROOT" hideNavBar>
            <Scene key="Connect" hideNavBar={true}>
              <Scene
                key="Connection"
                component={Connection}
                setConnection={(data) => this.setConnection(data)}
              />
              <Scene key="Register" component={Register} />
            </Scene>
            <Scene
              key="tabBar"
              user={this.state.user}
              initial={this.state.connected}
              userId={this.state.userId}
              firstName={this.state.firstName}
              lastName={this.state.lastName}
              address={this.state.address}
              email={this.state.email}
              like={this.state.like}
              deliverer={this.state.deliverer}
              userPoint={this.state.userPoint}
              profilPicture={this.state.profilPicture}
              getOrder={this.state.order}
              getCurrentOrders={this.state.currentOrders}
              setOrder={(order) => this.handleOrder(order)}
              disconnect={() => this.disconnect()}
              updateInfo={() => this.updateInfo()}
              clearCart={() => this.clearCart()}
              tabs={true}
              socket={this.state.socket}
              token={this.state.token}
              navBar={OpenHeader}
              tabBarPosition="bottom"
              tabBarComponent={
                this.state.deliverer == false
                  ? CustomTabBar
                  : CustomDelivererTabBar
              }
            >
              <Scene
                key="Homepage"
                component={Homepage}
                hideTabBar
                title="Accueil"
                switchDelivererState={(value) =>
                  this.switchDelivererState(value)
                }
                userChoice={() => this.userChoice()}
                deliverer={this.state.deliverer}
              />
              <Scene
                initial={this.state.userMadeChoice === true ? true : false}
                deliverer={this.state.deliverer}
                userChoice={() => this.userChoice()}
                key="Dashboard"
                component={Dashboard}
              />
              <Scene key="UserInformation" component={UserInformation} />
              <Scene
                key="Lobby"
                deliverer={this.state.deliverer}
                component={Lobby}
              />
              <Scene key="FindADelivery" component={FindADelivery} />
              <Scene key="QrReader" component={QrReader} />
              <Scene key="Contact" component={Contact} />
              <Scene key="Faq" component={Faq} />
              <Scene key="UpdateInformations" component={UpdateInformations} />
              <Scene key="UpdateAdress" component={UpdateAdress} />
              <Scene key="UpdatePassword" component={UpdatePassword} />
              <Scene key="UpdateMail" component={UpdateMail} />
              <Scene key="Payment" component={Payment} />
              <Scene key="ClientLocation" component={ClientLocation} />
              <Scene key="Rewards" component={Rewards} />
              <Scene key="ShopList" component={ShopList} />
              <Scene key="Cart" component={Cart} />
              <Scene key="Chat" component={Chat} wrap={false} />
              <Scene key="OrderMap" component={OrderMap} wrap={false} />
            </Scene>
          </Scene>
        </Router>
      );
    } else {
      return <LoaderView />;
    }
  }
}
