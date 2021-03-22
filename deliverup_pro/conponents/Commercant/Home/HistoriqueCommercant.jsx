import React from "react";
import { Modal, StyleSheet, View, Dimensions, FlatList } from "react-native";
import {
  Container,
  Text,
  Content,
  Card,
  CardItem,
  Left,
  Right,
  Body,
  Button,
  Spinner,
  List,
} from "native-base";
import * as Font from "expo-font";
import { Picker } from "@react-native-picker/picker";
import axios from "react-native-axios";
import { URL_API } from "../../../env";
import { TouchableOpacity } from "react-native";
import Styles from "../../Styles";

export default class HistoriqueCommercant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      selected: "oui",
      closedOrders: [],
      refreshing: false,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
    });

    this.getFinishedOrders();

    this.setState({ loading: false });
  }

  getFinishedOrders = async () => {
    const closedOrders = [];
    await axios
      .get(
        `${URL_API}/api/merchant/getOrder/merchant/${this.props.merchantId}/${this.props.token}`
      )
      .then((res) => {
        if (res.data[0]) {
          res.data.map((order) => {
            if (order.state === "cancel" || order.state === "done")
              closedOrders.push(order);
          });
          this.setState({ closedOrders });
        }
      })
      .catch((err) => {
        console.error(`Error at getting closed orders (historique) : ${err}`);
      });
  };

  onValueChange = (value) => {
    this.setState({ selected: value });
  };

  getOrderDetail = (index, total) => {
    const selectedOrder = this.state.closedOrders[index];
    selectedOrder.date = new Date(selectedOrder.date);
    this.setState({
      selectedOrder: { ...selectedOrder, total: total },
      modalVisible: true,
    });
  };

  render = () => {
    let total = 0;
    if (!this.state.loading) {
      return (
        <Container>
          <View style={Styles.containerView}>
            <Picker
              selectedValue={this.state.selected}
              style={{ height: 50, width: "90%", alignSelf: "center" }}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ selected: itemValue })
              }
            >
              <Picker.Item label="7 derniers jours" value="0" />
              <Picker.Item label="30 derniers jours" value="1" />
              <Picker.Item label="3 derniers mois" value="2" />
              <Picker.Item label="Tout" value="3" />
            </Picker>

            <List>
              <FlatList
                data={this.state.closedOrders}
                renderItem={({ item, index }) => {
                  const date = new Date(item.date);
                  let total = 0;
                  return (
                    <TouchableOpacity
                      onPress={() => this.getOrderDetail(index, total)}
                    >
                      <Card>
                        <CardItem
                          style={{
                            justifyContent: "center",
                            backgroundColor: "#fefee2",
                          }}
                        >
                          <Left>
                            <Text
                              style={{ color: "#3D0814" }}
                            >{`${date.getDate()}/${
                              date.getMonth() + 1
                            }/${date.getFullYear()}`}</Text>
                          </Left>
                          <Body>
                            <Text
                              style={{ color: "#3D0814" }}
                            >{`${item.user.firstName} ${item.user.lastName}`}</Text>
                            {item.state === "cancel" ? (
                              <Text
                                style={{
                                  color: "red",
                                  fontWeight: "bold",
                                  fontStyle: "italic",
                                }}
                              >
                                Annulée
                              </Text>
                            ) : null}
                          </Body>
                          <Right>
                            {item.products.map((product, index) => {
                              total += product.price * product.quantity;
                              return (
                                <Text
                                  style={{ color: "#3D0814" }}
                                  key={index}
                                >{`Total: ${total} €`}</Text>
                              );
                            })}
                          </Right>
                        </CardItem>
                      </Card>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(order) => order._id}
                refreshing={this.state.refreshing}
                onRefresh={() => this.getFinishedOrders()}
              />
            </List>

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
                  <Content>
                    {this.state.selectedOrder ? (
                      <View>
                        <Content padder>
                          <Text style={{ textAlign: "center" }}>
                            {`Commande du ${this.state.selectedOrder.date.getDate()}/${
                              this.state.selectedOrder.date.getMonth() + 1
                            }/${this.state.selectedOrder.date.getFullYear()}\n${this.state.selectedOrder.date.getHours()}:${this.state.selectedOrder.date.getMinutes()} \n${
                              this.state.selectedOrder.user.firstName
                            } ${this.state.selectedOrder.user.lastName}`}
                          </Text>
                          {this.state.selectedOrder.state === "cancel" ? (
                            <Text
                              style={{
                                textAlign: "center",
                                color: "red",
                                fontWeight: "bold",
                              }}
                            >
                              Annulée
                            </Text>
                          ) : null}
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
                          <Card>
                            {this.state.selectedOrder.products.map(
                              (article, index) => (
                                <CardItem key={index}>
                                  <View style={styles.leftContainer}>
                                    <Text>{`${article.name}`}</Text>
                                  </View>
                                  <View style={styles.rightContainer}>
                                    <Text style={{ alignSelf: "center" }}>
                                      x{`${article.quantity}`}
                                    </Text>
                                  </View>
                                  <View style={styles.rightContainer}>
                                    <Text style={{ alignSelf: "center" }}>
                                      {`${article.price}€`}
                                    </Text>
                                  </View>
                                </CardItem>
                              )
                            )}
                          </Card>
                          <Card>
                            <CardItem>
                              <Body>
                                <Text>Total</Text>
                              </Body>
                              <Right>
                                <Text>{this.state.selectedOrder.total}€</Text>
                              </Right>
                            </CardItem>
                          </Card>
                        </Content>
                      </View>
                    ) : null}
                    <Separator />
                    <View>
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

            {/* </Content> */}
          </View>
        </Container>
      );
    } else {
      return <Spinner />;
    }
  };
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
  modalView: {
    width: "90%",
    height: "90%",
    // margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    // padding: 35,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
  },
});
