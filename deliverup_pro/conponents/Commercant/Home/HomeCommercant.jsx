import React from "react";
import { Modal, StyleSheet, View, Alert } from "react-native";
import {
  Container,
  Text,
  Content,
  Card,
  CardItem,
  Right,
  Button,
  Thumbnail,
  Spinner,
} from "native-base";
import * as Font from "expo-font";
import { Actions } from "react-native-router-flux";
import axios from "react-native-axios";
import { URL_API, URL_MEDIA, URL_ORDERS } from "../../../env";

import { Audio } from "expo-av";
import * as Battery from "expo-battery"; // Battery getion
// Voir doc https://docs.expo.io/versions/latest/sdk/battery/
import DateTimePicker from "@react-native-community/datetimepicker";

import * as TaskManager from "expo-task-manager";

// Import socket
import { io } from "socket.io-client";
import Styles from "../../Styles";

export default class HomeCommercant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      selectedOrder: null,
      modalVisible: false,
      openMerchantModal: false,
      listNewOrder: [],
      listPendingDeliverer: [],
      listAwaitingDelivery: [],
      socket: io(URL_ORDERS),
      batteryLevel: null,
      timePickerVisible: false,
      closingTimeOut: null,
    };
  }

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };
  _subscribe = async () => {
    const batteryLevel = await Battery.getBatteryLevelAsync();
    // console.log(`Àctual batteryLevel ${batteryLevel}`)
    this.setState({ batteryLevel });
    this._subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      this.setState({ batteryLevel });
      console.log("batteryLevel changed!", batteryLevel);
    });
    // console.log(this._subscription)
  };

  setCloseTime = (p1) => {
    const timeOut = setTimeout(() => {
      this.state.socket.emit("merchantIsClosed", {
        merchantId: this.state.merchantId,
      });
    }, p1.nativeEvent.timestamp - Date.now());

    // const timeOut = setTimeout(()=>{
    //   this.state.socket.emit('merchantIsClosed', {
    //     merchantId: this.state.merchantId
    //   })
    // }, 3000)

    this.setState({
      closingTimeOut: timeOut,
      timePickerVisible: false,
    });
  };

  alertCloseMerchant = (p1, p2) => {
    if (p2) {
      const timestampSelected = new Date(p1.nativeEvent.timestamp);
      const now = new Date();
      const diff = timestampSelected - now;
      if (diff < 0) {
        return Alert.alert(
          `Vous ne pouvez fermer avant ${now.getHours()}:${now.getMinutes()}`,
          ``,
          [
            {
              text: "Ok pardon b0ss",
            },
          ],
          { cancelable: true }
        );
      }
      return Alert.alert(
        "Confirmer la fermeture",
        `${timestampSelected.getHours()}:${timestampSelected.getMinutes()} ${timestampSelected.getDate()}/${
          timestampSelected.getMonth() + 1
        }`,
        [
          {
            text: "Annuler",
            style: "cancel",
          },
          {
            text: "Confirmer",
            onPress: () => this.setCloseTime(p1),
          },
        ],
        { cancelable: true }
      );
    }
  };

  // test2 = () => {
  //   console.log(this.state.closingTimeOut)
  // }

  componentWillUnmount() {
    this._unsubscribe(); // Battery gestion
  }

  componentDidMount = async () => {
    // this._subscribe(); // Battery gestion

    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
    });
    await axios
      .get(`${URL_API}/api/merchant/order/${this.props.merchantId}`)
      .then((res) => {
        const listNewOrder = [];
        const listPendingDeliverer = [];
        const listAwaitingDelivery = [];
        res.data.map((order) => {
          if (order) {
            if (order.state === "pendingMerchant") listNewOrder.push(order);
            if (order.state === "pendingDeliverer")
              listPendingDeliverer.push(order);
            if (order.state === "awaitingDelivery")
              listAwaitingDelivery.push(order);
          }
        });
        this.setState({
          listNewOrder: listNewOrder,
          listPendingDeliverer: listPendingDeliverer,
          listAwaitingDelivery: listAwaitingDelivery,
        });
      });
    // console.log(this.props.merchantId,`\n` ,this.props.token)

    const NewOrder = new Audio.Sound();
    await NewOrder.loadAsync(require("../../../assets/alert.mp3"));
    NewOrder.setIsLoopingAsync(true);
    const UpdateOrder = new Audio.Sound();
    await UpdateOrder.loadAsync(require("../../../assets/ding.mp3"));
    UpdateOrder.setIsLoopingAsync(false);
    await this.setState({
      NewOrder: NewOrder,
      UpdateOrder: UpdateOrder,
    });

    this.setState({
      merchantId: this.props.merchantId,
      token: this.props.token,
    });

    this.state.socket.on("getNewOrder", async (data) => {
      // console.log(data)
      const updatedListNewOrder = [data];
      this.state.listNewOrder.map((order) => updatedListNewOrder.push(order));
      // updatedListNewOrder.push(data);
      this.setState({ listNewOrder: updatedListNewOrder });
      // const { sound: { _eventEmitter, _subscriptions, ...rest1}, ...rest } = this.state.nico
      // console.log(rest)
      await this.state.NewOrder.playAsync();
    });

    this.state.socket.on("delivererHasTakenOrder", async (data) => {
      await this.state.UpdateOrder.playAsync();
      // console.log(data)
      const updatedListPendingDeliverer = [];
      const updatedListAwaitingDelivery = [];
      this.state.listPendingDeliverer.map((order) =>
        updatedListPendingDeliverer.push(order)
      );

      const index = updatedListPendingDeliverer.findIndex(
        (order) => order._id === data._id
      );
      updatedListPendingDeliverer.splice(index, 1);
      this.state.listAwaitingDelivery.map((order) =>
        updatedListAwaitingDelivery.push(order)
      );
      updatedListAwaitingDelivery.push(data);
      this.setState({
        listPendingDeliverer: updatedListPendingDeliverer,
        listAwaitingDelivery: updatedListAwaitingDelivery,
      });

      await this.state.UpdateOrder.unloadAsync();
    });

    this.state.socket.on("delivererHasScannedOrder", async (data) => {
      const updatedListAwaitingDelivery = [];
      this.state.listAwaitingDelivery.map((order) =>
        updatedListAwaitingDelivery.push(order)
      );
      const index = updatedListAwaitingDelivery.findIndex(
        (order) => order._id === data._id
      );
      updatedListAwaitingDelivery.splice(index, 1);
      // console.log(updatedListAwaitingDelivery)
      this.setState({ listAwaitingDelivery: updatedListAwaitingDelivery });
    });

    this.state.socket.on("error", (data) => console.log(data));

    this.setState({ loading: false });
  };

  // Method called from Header
  showOpenModal = async () => {
    this.setState({ openMerchantModal: true });
    this.state.socket.emit("merchantIsOpen", {
      merchantId: this.state.merchantId,
      token: this.state.token,
    });
  };

  socketAcceptOrder = async (index) => {
    await this.state.NewOrder.stopAsync();
    const updatedListNewOrder = [];
    const selectedOrder = this.state.listNewOrder[index];
    this.state.listNewOrder.map((order) => updatedListNewOrder.push(order));
    updatedListNewOrder.splice(index, 1);
    this.setState({ listNewOrder: updatedListNewOrder });
    const updatedListPendingDeliverer = [];
    updatedListPendingDeliverer.push(selectedOrder);
    this.state.listPendingDeliverer.map((order) =>
      updatedListPendingDeliverer.push(order)
    );
    this.setState({ listPendingDeliverer: updatedListPendingDeliverer });

    // console.log(selectedOrder)
    const data = {
      token: this.state.token,
      ...selectedOrder,
    };
    await this.state.socket.emit("acceptedOrder", data);
  };

  getOrderDetail = (index, tab) => {
    const selectedOrder = tab[index];
    // console.log(selectedOrder, "from getOrderDetail")
    selectedOrder.date = new Date(selectedOrder.date);
    this.setState({
      selectedOrder: selectedOrder,
      modalVisible: true,
    });
  };

  render() {
    let total = 0;
    // console.log(this.state.listAwaitingDelivery)
    if (!this.state.loading) {
      return (
        <Container>
          <View style={Styles.containerView}>
            {/* <Button onPress={()=>this.test1()}>
              <Text>1</Text>
            </Button>
            <Separator/>
            <Button onPress={()=>this.test2()}>
              <Text>2</Text>
            </Button> */}
            <Content padder>
              {!this.state.listNewOrder[0] &&
              !this.state.listPendingDeliverer[0] &&
              !this.state.listAwaitingDelivery[0] ? (
                <View
                  style={{
                    // height: Dimensions.get("window").height,
                    height: 500,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* <Icon
                    active
                    name="emoji-sad"
                    type="Entypo"
                    style={{ fontSize: 50 }}
                  /> */}
                  <Text
                    style={{
                      fontSize: 45,
                      textAlign: "center",
                      fontStyle: "italic",
                    }}
                  >
                    Pas de commandes en cours
                  </Text>
                </View>
              ) : null}

              {/* ////////////////////////////////////////////////////////////// */}

              {this.state.listNewOrder[0] ? (
                <Card style={Styles.cardItemHeaderStyle}>
                  <Text style={Styles.textOrderListStyle}>
                    {this.state.listNewOrder.length > 1
                      ? "Nouvelles Commandes"
                      : "Nouvelle Commande"}{" "}
                    ({this.state.listNewOrder.length})
                  </Text>
                </Card>
              ) : null}

              {/* ////////////////////////////////////////////////////////////// */}

              {this.state.listNewOrder.map((order, index) => (
                <Card
                  key={index}
                  style={{ borderColor: "orange", borderWidth: 3 }}
                >
                  <CardItem
                    style={{
                      backgroundColor: "#3D0814",
                      justifyContent: "center",
                    }}
                    button
                    onPress={() =>
                      this.getOrderDetail(index, this.state.listNewOrder)
                    }
                  >
                    <View>
                      <Text
                        style={{
                          fontSize: 20,
                          color: "#fefee2",
                        }}
                      >
                        {`${order.user.firstName}`}
                      </Text>
                    </View>
                    <Right>
                      <Button
                        style={{
                          backgroundColor: "#fefee2",
                          borderWidth: 0.5,
                          borderColor: "orange",
                        }}
                        // onPress={() => this.acceptOrder(index)}
                        onPress={() => this.socketAcceptOrder(index)}
                      >
                        <Text style={{ color: "#3D0814" }}>Accept</Text>
                      </Button>
                    </Right>
                  </CardItem>
                </Card>
              ))}

              <Separator />

              {/* ////////////////////////////////////////////////////////////// */}

              {this.state.listPendingDeliverer[0] ? (
                <Card style={Styles.cardItemHeaderStyle}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      color: "#3D0814",
                      textAlign: "center",
                    }}
                  >
                    Client
                    {this.state.listPendingDeliverer.length > 1 ? "s " : " "}
                    en attente de livreur (
                    {this.state.listPendingDeliverer.length})
                  </Text>
                </Card>
              ) : null}

              {/* ////////////////////////////////////////////////////////////// */}

              {this.state.listPendingDeliverer.map((order, index) => (
                <Card
                  key={index}
                  style={{ borderColor: "orange", borderWidth: 3 }}
                >
                  <CardItem
                    button
                    style={{
                      justifyContent: "center",
                      backgroundColor: "#fefee2",
                    }}
                    onPress={() =>
                      this.getOrderDetail(
                        index,
                        this.state.listPendingDeliverer
                      )
                    }
                  >
                    <View>
                      <Text>{`${order.user.firstName} ${order.user.lastName}`}</Text>
                      {/* <Text>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</Text> */}
                    </View>
                    <Right></Right>
                  </CardItem>
                </Card>
              ))}
              <Separator />
              {/* //////////////////////////////////////////////////////////// */}
              {this.state.listAwaitingDelivery[0] ? (
                <Card
                  style={{
                    height: 50,
                    justifyContent: "center",
                    backgroundColor: "#fefee2",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      color: "#3D0814",
                      textAlign: "center",
                    }}
                  >
                    {this.state.listAwaitingDelivery.length > 1
                      ? "Des livreurs s'occupent de ces commandes"
                      : "Un livreur s'occupe de cette commande"}{" "}
                    ({this.state.listAwaitingDelivery.length})
                  </Text>
                </Card>
              ) : null}

              {/* ////////////////////////////////////////////////////////////// */}

              {this.state.listAwaitingDelivery.map((order, index) => (
                <Card
                  key={index}
                  style={{ borderColor: "orange", borderWidth: 3 }}
                >
                  <CardItem
                    style={{
                      justifyContent: "center",
                      backgroundColor: "#fefee2",
                    }}
                    button
                    onPress={() =>
                      this.getOrderDetail(
                        index,
                        this.state.listAwaitingDelivery
                      )
                    }
                  >
                    <View>
                      <Text>
                        {`${order.user.firstName} ${order.user.lastName}`}
                      </Text>
                      <Text>{`Livré par : ${order.deliverer.firstName}`}</Text>
                    </View>

                    <Right>
                      <Thumbnail
                        source={{
                          uri: order.deliverer.pic
                            ? `${order.deliverer.pic}`
                            : `${URL_MEDIA}/picture/user/${order.deliverer.profilePicture}`,
                        }}
                      />
                    </Right>
                  </CardItem>
                </Card>
              ))}

              {/* /////////////////////////////////////////////////////////// */}

              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => this.setState({ modalVisible: false })}
              >
                <View style={styles.centeredView}>
                  <View
                    style={{
                      width: "90%",
                      height: "95%",
                      backgroundColor: "#fefee2",
                      borderRadius: 20,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 1,
                        height: 1,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 10,
                      elevation: 5,
                    }}
                  >
                    <Content padder>
                      {this.state.selectedOrder ? (
                        <View>
                          <Text style={{ textAlign: "center" }}>
                            {`Commande\n${
                              this.state.selectedOrder.user.firstName
                            } ${
                              this.state.selectedOrder.user.lastName
                            }\n${this.state.selectedOrder.date.getHours()}:${this.state.selectedOrder.date.getMinutes()}`}
                          </Text>
                          <Separator />
                          <Card>
                            <CardItem style={{ backgroundColor: "#3D0814" }}>
                              <View style={styles.leftContainer}>
                                <Text
                                  style={{
                                    alignSelf: "center",
                                    color: "#fefee2",
                                  }}
                                >
                                  Article
                                </Text>
                              </View>

                              <View style={styles.rightContainer}>
                                <Text
                                  style={{
                                    alignSelf: "center",
                                    color: "#fefee2",
                                  }}
                                >
                                  Qté
                                </Text>
                              </View>

                              <View style={styles.rightContainer}>
                                <Text
                                  style={{
                                    alignSelf: "center",
                                    color: "#fefee2",
                                  }}
                                >
                                  Prix
                                </Text>
                              </View>
                            </CardItem>
                          </Card>
                          <Separator />
                          {this.state.selectedOrder.products.map(
                            (article, index) => (
                              <View>
                                <Card key={index}>
                                  <CardItem>
                                    <View style={styles.leftContainer}>
                                      <Text>{`${article.name}`}</Text>
                                    </View>
                                    <View style={styles.centerContainer}>
                                      <Text style={{ alignSelf: "center" }}>
                                        x{`${article.quantity}`}
                                      </Text>
                                    </View>
                                    <View style={styles.centerContainer}>
                                      <Text style={{ alignSelf: "center" }}>
                                        {`${article.price}€`}
                                      </Text>
                                    </View>
                                  </CardItem>
                                </Card>
                                <Separator />
                                <Card>
                                  <CardItem>
                                    <View
                                      style={{
                                        justifyContent: "center",
                                        width: "100%",
                                      }}
                                    >
                                      <Text style={{ textAlign: "center" }}>
                                        Total:{" "}
                                        {
                                          (total +=
                                            article.quantity * article.price)
                                        }
                                        €
                                      </Text>
                                    </View>
                                  </CardItem>
                                </Card>
                              </View>
                            )
                          )}
                        </View>
                      ) : null}
                      <Separator />
                      <View>
                        {this.state.selectedOrder ? (
                          this.state.selectedOrder.state ===
                          "awaitingDelivery" ? (
                            <View>
                              <Button
                                rounded
                                style={Styles.buttonSign}
                                onPress={() => {
                                  const { selectedOrder } = this.state;
                                  this.setState({ modalVisible: false });
                                  // console.log(selectedOrder)
                                  Actions.generateQR({
                                    selectedOrder: selectedOrder,
                                  });
                                }}
                              >
                                <Text>QR Code</Text>
                              </Button>
                              <Separator />
                            </View>
                          ) : null
                        ) : null}
                        <Button
                          rounded
                          style={Styles.buttonSign}
                          onPress={() => this.setState({ modalVisible: false })}
                        >
                          <Text>Retour</Text>
                        </Button>
                      </View>
                    </Content>
                  </View>
                </View>
              </Modal>
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.openMerchantModal}
                onRequestClose={() =>
                  this.setState({ openMerchantModal: false })
                }
              >
                <View style={styles.centeredView}>
                  <View style={styles.openMerchantModal}>
                    {/* <Content> */}
                    <View
                      style={{
                        borderColor: "black",
                        borderWidth: 1,
                        width: "90%",
                      }}
                    >
                      <Text style={{ fontSize: 30, textAlign: "center" }}>
                        Programmer la fermeture du jour ?
                      </Text>
                    </View>

                    <View
                      style={{
                        borderColor: "black",
                        borderWidth: 1,
                        flexDirection: "row",
                        justifyContent: "space-around",
                        width: "90%",
                      }}
                    >
                      <Button
                        rounded
                        style={{ alignSelf: "center" }}
                        onPress={() =>
                          this.setState({
                            timePickerVisible: true,
                            openMerchantModal: false,
                          })
                        }
                      >
                        <Text>Oui</Text>
                      </Button>
                      <Button
                        rounded
                        style={{ alignSelf: "center" }}
                        onPress={() =>
                          this.setState({
                            openMerchantModal: false,
                          })
                        }
                      >
                        <Text>Non</Text>
                      </Button>
                    </View>

                    {/* </Content> */}
                  </View>
                </View>
              </Modal>
              {this.state.timePickerVisible && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={new Date()}
                  minimumDate={new Date(Date.now() + 10 * 60 * 1000)}
                  mode="time"
                  is24Hour={true}
                  display="spinner"
                  onChange={(p1, p2) => this.alertCloseMerchant(p1, p2)}
                />
              )}
            </Content>
          </View>
        </Container>
      ); //<-- end of return
    } else {
      return <Spinner />;
    }
  }
}
const Separator = (props) => (
  <View style={{ marginVertical: props.value || 8 }} />
);

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22
  },
  openMerchantModal: {
    width: "90%",
    height: "50%",
    // margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    justifyContent: "space-evenly",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalView: {
    width: "90%",
    height: "90%",
    // margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    // padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  centerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // borderColor: 'black',
    // borderWidth: 1,
    marginHorizontal: "1%",
  },
  rightContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "15%",
  },
  leftContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  backgroundImage: {
    position: "absolute",
    resizeMode: "stretch",
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
