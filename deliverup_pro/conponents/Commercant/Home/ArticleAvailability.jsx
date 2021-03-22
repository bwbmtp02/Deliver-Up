import React from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  View,
  Dimensions,
  Image,
} from "react-native";
import {
  Container,
  Text,
  Content,
  Left,
  Right,
  Icon,
  Button,
  Spinner,
  Thumbnail,
  Body,
  Card,
  CardItem,
  Input,
} from "native-base";
import * as Font from "expo-font";
import axios from "react-native-axios";
import { URL_API, URL_MEDIA } from "../../../env";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import Styles from "../../Styles";

export default class ArticleAvailability extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      modalVisible: false,
      modifyModalVisible: false,
      listArticle: [],
      addArticleId: "",
      addArticleName: "",
      addArticlePrice: "",
      addArticlePicture: "",
      image: null,
    };
  }

  componentDidMount = async () => {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
    });
    const idCommercant = this.props.merchantId;
    const listArticle = [];
    await axios
      .get(`${URL_API}/api/merchant/profile/id/${idCommercant}`)
      .then((res) =>
        res.data.products.map((article) => listArticle.push(article))
      )
      .catch((err) =>
        console.error(
          `Error at getting merchant infos (articleAvailability) : ${err}`
        )
      );
    this.setState({
      listArticle: listArticle,
      loading: false,
    });
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  createAlertDeleteProduct = (index) => {
    return Alert.alert(
      "Voulez vous supprimer cet article ?",
      "(Suppression définitive)",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Confirmer",
          onPress: () => this.deleteArticle(index),
        },
      ],
      { cancelable: false }
    );
  };

  deleteArticle = async (index) => {
    const idCommercant = this.props.merchantId;
    const updatedList = [];
    this.state.listArticle.map((item) => updatedList.push(item));
    await axios
      .post(`${URL_MEDIA}/deleteMerchantProduct/`, {
        id: this.props.merchantId,
        idProduct: updatedList[index].picture,
      })
      .catch((err) =>
        console.error(
          `Error at deleting product picture (articleAvailability): ${err}`
        )
      );
    updatedList.splice(index, 1);
    this.setState({ listArticle: updatedList });
    await axios
      .patch(`${URL_API}/api/merchant/update/${idCommercant}`, {
        products: updatedList,
      })
      .catch((err) =>
        console.error(
          `Error at updating product list (articleAvailability) : ${err}`
        )
      );
  };

  addArticle = () => {
    this.setState({ image: null });
    const idCommercant = this.props.merchantId;
    const updatedList = [];
    this.state.listArticle.map((item) => updatedList.push(item));
    const newArticle = {
      name: this.state.addArticleName,
      price: this.state.addArticlePrice,
      picture: this.state.addArticlePicture,
      available: true,
    };
    updatedList.push(newArticle);
    this.setState({
      listArticle: updatedList,
      addArticleName: "",
      addArticlePrice: "",
      addArticlePicture: "",
    });
    axios
      .patch(`${URL_API}/api/merchant/update/${idCommercant}`, {
        products: updatedList,
      })
      .catch((err) =>
        console.error(`Error at adding new article on api_data : ${err}`)
      );
  };

  modifyArticle = async () => {
    const idCommercant = this.props.merchantId;
    const updatedList = [];
    this.state.listArticle.map((article) => {
      if (article._id !== this.state.modifyArticleId) {
        updatedList.push(article);
      } else {
        article.name = this.state.modifyArticleName;
        article.price = this.state.modifyArticlePrice;
        updatedList.push(article);
      }
    });
    await axios
      .patch(`${URL_API}/api/merchant/update/${idCommercant}`, {
        products: updatedList,
      })
      .catch((err) =>
        console.error(
          `Error at updating product list (articleAvailability) : ${err}`
        )
      );
  };

  pressModifyArticle = (index) => {
    const selectedArticle = this.state.listArticle[index];
    this.setState({
      modifyModalVisible: true,
      modifyArticleId: selectedArticle._id,
      modifyArticleName: selectedArticle.name,
      modifyArticlePrice: selectedArticle.price,
    });
  };

  unavailableArticle = async (index) => {
    const idCommercant = this.props.merchantId;
    const updatedList = [];
    this.state.listArticle.map((item, key) => updatedList.push(item));
    if (
      updatedList.some((item, i) => {
        if (i == index) {
          item.available = !item.available;
          return true;
        } else {
          return false;
        }
      }) === true
    ) {
      this.setState({ listArticle: updatedList });
      await axios
        .patch(`${URL_API}/api/merchant/update/${idCommercant}`, {
          products: updatedList,
        })
        .catch((err) =>
          console.error(
            `Error at updating product availability (articleAvailability) : ${err}`
          )
        );
    }
  };

  securePriceInputAdd = (value) => {
    const replaceSpace = value.replace(" ", "");
    const replaceDash = replaceSpace.replace("-", "");
    const replaceComma = replaceDash.replace(",", ".");
    // const re = /[+-]?([0-9]+([.][0-9]*)?[.][0-9]+)/
    // if(!re.test(replaceComma)) {
    //   this.setState({ addArticlePrice: replaceComma })
    // }

    this.setState({ addArticlePrice: replaceComma });
  };

  securePriceInputModify = (value) => {
    const replaceSpace = value.replace(" ", "");
    const replaceDash = replaceSpace.replace("-", "");
    const replaceComma = replaceDash.replace(",", ".");
    // const re = /[+-]?([0-9]+([.][0-9]*)?[.][0-9]+)/
    // if(!re.test(replaceComma)) {
    //   this.setState({ addArticlePrice: replaceComma })
    // }

    this.setState({ modifyArticlePrice: replaceComma });
  };

  createPickImageAlert = () => {
    return Alert.alert(
      "Selectionner une image",
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
  };

  askForLibraryPermission = async () => {
    // console.log('salut')
    const permissionResult = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    // console.log(permissionResult)
    if (permissionResult.status !== "granted") {
      Alert.alert("Vous n'avez pas autorisé l'accès à vos photos !", [
        { text: "ok" },
      ]);
      return false;
    }
    return true;
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
      let response = await fetch(`${URL_MEDIA}/newMerchantProductPicture`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        // send our base64 string as POST request
        body: JSON.stringify({
          imgsource: image.base64,
          merchantId: this.props.merchantId,
          productId: "newProduct",
          date: new Date().getTime(),
        }),
      });
      const data = await response.json();
      // console.log(data)
      this.setState({
        image: `${URL_MEDIA}/merchant/${this.props.merchantId}/${data.productPicture}`,
        addArticlePicture: data.productPicture,
      });
    }
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
      let response = await fetch(`${URL_MEDIA}/newMerchantProductPicture`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        // send our base64 string as POST request
        body: JSON.stringify({
          imgsource: image.base64,
          merchantId: this.props.merchantId,
          productId: "newProduct",
          date: new Date().getTime(),
        }),
      });
      let data = await response.json();
      this.setState({
        image: `${URL_MEDIA}/merchant/${this.props.merchantId}/${data.productPicture}`,
        addArticlePicture: data.productPicture,
      });
    }
  };

  render() {
    if (!this.state.loading) {
      return (
        <Container>
          <View style={Styles.containerView}>
            <Content padder>
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => this.setModalVisible(false)}
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
                      <Text
                        style={{
                          fontSize: 25,
                          fontWeight: "bold",
                          marginBottom: 15,
                          textAlign: "center",
                          color: "#3D0814",
                        }}
                      >
                        Ajouter un Article
                      </Text>

                      <Card transparent>
                        <CardItem style={Styles.cardItemModify}>
                          <Input
                            placeholder="Nom de l'article"
                            style={Styles.modifyProfilStyle}
                            value={this.state.addArticleName}
                            onChangeText={(value) =>
                              this.setState({ addArticleName: value })
                            }
                          />
                        </CardItem>
                      </Card>
                      <Card transparent>
                        <CardItem style={Styles.cardItemModify}>
                          <Input
                            placeholder="Prix"
                            style={Styles.modifyProfilStyle}
                            value={this.state.addArticlePrice}
                            onChangeText={(value) =>
                              this.securePriceInputAdd(value)
                            }
                            keyboardType="numeric"
                          />
                        </CardItem>
                      </Card>

                      <Button
                        style={Styles.buttonSign}
                        rounded
                        onPress={() => this.createPickImageAlert()}
                      >
                        <Text>Ajouter une photo</Text>
                      </Button>
                      <Separator value={3} />
                      {this.state.image !== null ? (
                        <View>
                          <Image
                            style={{ height: 150, width: 150 }}
                            source={{ uri: this.state.image }}
                          />
                        </View>
                      ) : (
                        <Separator value={50} />
                      )}
                      <Separator value={3} />
                      <Button
                        rounded
                        onPress={() => {
                          this.addArticle();
                          this.setModalVisible(false);
                        }}
                        style={Styles.buttonSign}
                      >
                        <Text>Ajouter</Text>
                      </Button>
                      <Separator value={3} />

                      <Button
                        rounded
                        onPress={() => {
                          this.setState({
                            addArticleName: "",
                            addArticlePrice: "",
                            addArticlePicture: "",
                            image: null,
                          });
                          this.setModalVisible(false);
                        }}
                        style={Styles.buttonSign}
                      >
                        <Text>Retour</Text>
                      </Button>
                    </Content>
                  </View>
                </View>
              </Modal>
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modifyModalVisible}
                onRequestClose={() =>
                  this.setState({ modifyModalVisible: false })
                }
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
                      <Text
                        style={{
                          fontSize: 25,
                          fontWeight: "bold",
                          marginBottom: 15,
                          textAlign: "center",
                          color: "#3D0814",
                        }}
                      >
                        Modifier un Article
                      </Text>

                      <Card transparent>
                        <CardItem style={Styles.cardItemModify}>
                          <Input
                            placeholder="Nom de l'article"
                            style={Styles.modifyProfilStyle}
                            value={this.state.modifyArticleName}
                            onChangeText={(value) =>
                              this.setState({ modifyArticleName: value })
                            }
                          />
                        </CardItem>
                      </Card>
                      <Card transparent>
                        <CardItem style={Styles.cardItemModify}>
                          <Input
                            placeholder="Prix"
                            style={Styles.modifyProfilStyle}
                            value={this.state.modifyArticlePrice}
                            onChangeText={(value) =>
                              this.securePriceInputModify(value)
                            }
                            keyboardType="numeric"
                          />
                        </CardItem>
                      </Card>
                      <Separator value={"20%"} />
                      <Button
                        style={Styles.buttonSign}
                        rounded
                        onPress={() => {
                          this.modifyArticle();
                          this.setState({ modifyModalVisible: false });
                        }}
                      >
                        <Text>Modifier</Text>
                      </Button>
                      <Separator value={3} />
                      <Button
                        style={Styles.buttonSign}
                        rounded
                        onPress={() => {
                          this.setState({
                            modifyArticleName: "",
                            modifyArticlePrice: "",
                            image: null,
                          });
                          this.setState({ modifyModalVisible: false });
                        }}
                      >
                        <Text>Retour</Text>
                      </Button>
                    </Content>
                  </View>
                </View>
              </Modal>

              <Separator value={1} />
              <Button
                rounded
                style={{
                  alignSelf: "flex-end",
                  borderWidth: 1,
                  borderColor: "orange",
                  backgroundColor: "#3D0814",
                }}
                onPress={() => this.setModalVisible(true)}
              >
                <Text style={{ color: "orange" }}>Ajouter un article</Text>
              </Button>
              <Separator value={5} />

              {this.state.listArticle.map((article, index) => (
                <Card key={index}>
                  <CardItem
                    style={{
                      borderColor: "orange",
                      borderWidth: 1,
                      backgroundColor: article.available
                        ? "#fefee2"
                        : "lightgrey",
                    }}
                    button
                    onPress={() => this.pressModifyArticle(index)}
                  >
                    <Left>
                      <Thumbnail
                        large
                        square
                        source={{
                          uri: `${URL_MEDIA}/merchant/${this.props.merchantId}/${article.picture}`,
                        }}
                      />
                    </Left>
                    <Body style={{ justifyContent: "center" }}>
                      <Text
                        style={{
                          color: "#3D0814",
                          fontSize: 17,
                          fontWeight: "bold",
                        }}
                      >
                        {article.name}
                      </Text>
                      <Separator value={3} />
                      <Text
                        note
                        style={{ fontSize: 15 }}
                      >{`${article.price} €`}</Text>
                      <Text style={{ color: "red" }}>
                        {`${article.available ? `` : `Indisponible`}`}
                      </Text>
                    </Body>
                    <Right>
                      <Button
                        danger
                        rounded
                        onPress={() => this.createAlertDeleteProduct(index)}
                      >
                        <Icon
                          type="AntDesign"
                          name="delete"
                          style={{ color: "white", fontSize: 15 }}
                        />
                      </Button>
                      <Separator value={2} />
                      <Button
                        light
                        rounded
                        onPress={() => this.unavailableArticle(index)}
                      >
                        <Icon
                          type="Entypo"
                          name="block"
                          style={{ color: "red", fontSize: 15 }}
                        />
                      </Button>
                    </Right>
                  </CardItem>
                </Card>
              ))}

              <View style={{ marginTop: 150 }}></View>
            </Content>
          </View>
        </Container>
      );
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
  modalView: {
    // margin: 20,
    width: "90%",
    height: "90%",
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
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  backgroundImage: {
    position: "absolute",
    resizeMode: "stretch",
    flex: 1,
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
  },
});
