import React from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import axios from "react-native-axios";
import {
  Card,
  CardItem,
  Content,
  Button,
  Input,
  Thumbnail,
  Text,
  Title,
  Container,
  Label,
} from "native-base";
import { Actions } from "react-native-router-flux";
import Autocomplete from "react-native-autocomplete-input";
import * as Font from "expo-font";

import Styles from "../../Styles";
import { URL_API } from "../../../env";

export default class Inscription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      loading: true,
      // step one
      enterprise: "",
      lastname: "",
      phone: "",
      // step 2
      categories: [
        {
          name: "Boulangerie",
          foodShop: true,
          imageBackground: require("../../../images/boulangerie.jpg"),
        },
        {
          name: "Epicerie",
          foodShop: true,
          imageBackground: require("../../../images/epicerie.jpeg"),
        },
        {
          name: "Pharmacie",
          foodShop: false,
          imageBackground: require("../../../images/pharmacie.jpg"),
        },
        {
          name: "Boucherie",
          foodShop: true,
          imageBackground: require("../../../images/boucherie.jpg"),
        },
        {
          name: "Fleuriste",
          foodShop: false,
          imageBackground: require("../../../images/fleuriste.jpg"),
        },
        {
          name: "Fromagerie",
          foodShop: true,
          imageBackground: require("../../../images/fromagerie.jpg"),
        },
        {
          name: "Sport",
          foodShop: false,
          imageBackground: require("../../../images/sports.png"),
        },
      ],
      //step 3
      address: "",
      adressInput: "",
      autoCompleteAdressLabel: [],
      iban: "",
      siret: "",
      // errors
      error: [],
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
    });
    this.setState({ loading: false });
  }

  handleAdressChange = (value) => {
    this.setState({ adressInput: value });
    if (this.state.adressInput !== "") {
      axios
        .get(
          `https://api-adresse.data.gouv.fr/search/?q=${this.state.adressInput.replace(
            " ",
            "%20"
          )}&type=housenumber&autocomplete=1`
        )
        .then((res) => {
          const autoCompleteAdressLabel = [];
          if (res.data.features[0]) {
            res.data.features
              .slice(0, 3)
              .map((item) => autoCompleteAdressLabel.push(item));
            this.setState({ autoCompleteAdressLabel });
          }
        })
        .catch((err) => console.error(err));
    }
  };

  handleClickStepOne = () => {
    const error = [];
    if (this.state.enterprise === "")
      error.push("Veuillez entrer le nom de votre enterprise");
    if (this.state.lastname === "")
      error.push("Veuillez entrer votre nom de famille");
    if (this.state.phone === "")
      error.push("Veuillez entrer votre numéro de téléphone");
    this.setState({ error });
    if (!error[0]) {
      this.setState({ step: 2 });
    }
  };

  handleClickStepThree = () => {
    const error = [];
    if (this.state.iban === "") error.push("Veuillez entrer votre IBAN");
    if (this.state.siret === "")
      error.push("Veuillez entrer votre numéro de Siret");
    if (this.state.address === "")
      error.push("Veuillez entrer un adresse valide");
    this.setState({ error });
    if (!error[0]) {
      this.handleSubmit();
    }
  };

  handleSubmit = async () => {
    const data = {
      foodshop: this.state.foodShop,
      category: this.state.category,
      name: this.state.lastname,
      enterprise: this.state.enterprise,
      address: {
        number: this.state.address.properties.housenumber,
        street: this.state.address.properties.street,
        zipcode: this.state.address.properties.postcode,
        city: this.state.address.properties.city,
      },
      location: [
        this.state.address.geometry.coordinates[1],
        this.state.address.geometry.coordinates[0],
      ],
      email: this.props.email,
      phone: this.state.phone,
      password: this.props.password,
      IBAN: this.state.iban,
      siretNumber: this.state.siret,
    };
    // console.log(data);
    await axios.post(`${URL_API}/api/merchant/new`, data).catch((err) => {
      console.error(`Error at creating new merchant from Inscription : ${err}`);
      this.setState({ error: ["Erreur serveur, réessayez ultérieurement"] });
    });
    const login = {
      email: data.email,
      password: data.password,
    };
    await axios
      .post(`${URL_API}/api/login/merchant`, login)
      .then((res) => {
        this.props.setConnection(res.data);
      })
      .catch((err) => {
        console.error(`Login Error at API_DATA from Inscription3 : ${err}`);
        this.setState({ error: ["Erreur serveur, réessayez ultérieurement"] });
      });
  };

  stepOne = () => {
    return (
      <View style={Styles.containerView}>
        <Separator />
        <Title style={Styles.titleStyle}>Inscription</Title>
        <Separator />

        <Card transparent>
          <CardItem style={Styles.cardItemModify}>
            <Thumbnail
              small
              style={Styles.thumbnailWithMargin}
              source={{
                uri: `https://cdn1.iconfinder.com/data/icons/flat-business-icons/128/user-512.png`,
              }}
            />
            <Input
              onChangeText={(enterprise) => this.setState({ enterprise })}
              autoCorrect={false}
              style={Styles.modifyProfilStyle}
              placeholder="Nom de l'enterprise"
            />
          </CardItem>
        </Card>

        <Card transparent>
          <CardItem style={Styles.cardItemModify}>
            <Thumbnail
              small
              style={Styles.thumbnailWithMargin}
              source={{
                uri: `https://cdn1.iconfinder.com/data/icons/flat-business-icons/128/user-512.png`,
              }}
            />
            <Input
              onChangeText={(lastname) => this.setState({ lastname })}
              autoCompleteType="name"
              autoCorrect={false}
              style={Styles.modifyProfilStyle}
              placeholder="Votre nom de famille"
            />
          </CardItem>
        </Card>
        <Card transparent>
          <CardItem style={Styles.cardItemModify}>
            <Thumbnail
              small
              style={Styles.thumbnailWithMargin}
              source={{
                uri: `https://cdn1.iconfinder.com/data/icons/flat-business-icons/128/mobile-512.png`,
              }}
            />
            <Input
              onChangeText={(phone) => this.setState({ phone })}
              autoCompleteType="tel"
              keyboardType="numeric"
              style={Styles.modifyProfilStyle}
              placeholder="Téléphone"
            />
          </CardItem>
        </Card>
        <Separator />
        {this.state.error ? (
          <View>
            {this.state.error.map((error, index) => (
              <Text key={index} style={Styles.textError}>
                {`${error}`}
              </Text>
            ))}
            {this.state.error[0] ? <Separator /> : null}
          </View>
        ) : null}
        <Button
          rounded
          block
          onPress={() => this.handleClickStepOne()}
          style={Styles.buttonSign}
        >
          <Text style={Styles.textChoiceStyle}> Continuer </Text>
        </Button>
      </View>
    );
  };

  stepTwo = () => {
    return (
      <Container>
        <Content>
          <View style={Styles.containerView}>
            {/* <Separator />
            <Text
              style={{
                fontSize: 25,
                textAlign: "center",
                fontWeight: "bold",
                color: "#3D0814",
                textTransform: "uppercase",
              }}
            ></Text>
            <Separator value={5} /> */}
            {this.state.categories
              ? this.state.categories.map((category, index) => (
                  <Card key={index}>
                    <CardItem cardBody>
                      <ImageBackground
                        source={category.imageBackground}
                        style={styles.ImageBackground}
                      >
                        <TouchableOpacity
                          style={styles.card}
                          onPress={() =>
                            Alert.alert(
                              "Confirmation",
                              `Valider ${category.name} ?`,
                              [
                                {
                                  text: "Annuler",
                                  style: "cancel",
                                },
                                {
                                  text: "Valider",
                                  onPress: () => {
                                    this.setState({
                                      foodShop: category.foodShop,
                                      category: category.name,
                                      step: 3,
                                    });
                                  },
                                },
                              ],
                              { cancelable: true }
                            )
                          }
                        >
                          <Text
                            style={Styles.textShopCategory}
                          >{`${category.name}`}</Text>
                        </TouchableOpacity>
                      </ImageBackground>
                    </CardItem>
                  </Card>
                ))
              : null}
          </View>
        </Content>
      </Container>
    );
  };

  stepThree = () => {
    return (
      <View style={Styles.containerView}>
        <Separator />
        <Card transparent>
          <CardItem style={Styles.cardItemModify}>
            <Thumbnail
              small
              style={Styles.thumbnailWithMargin}
              source={{
                uri: `https://cdn0.iconfinder.com/data/icons/business-2-10/128/77-256.png`,
              }}
            />
            <Input
              style={Styles.modifyProfilStyle}
              onChangeText={(iban) => this.setState({ iban })}
              placeholder="IBAN"
            />
          </CardItem>
        </Card>
        <Separator />
        <Card transparent>
          <CardItem style={Styles.cardItemModify}>
            <Thumbnail
              small
              style={Styles.thumbnailWithMargin}
              source={{
                uri: `https://cdn0.iconfinder.com/data/icons/business-2-10/128/85-256.png`,
              }}
            />
            <Input
              onChangeText={(siret) => this.setState({ siret })}
              style={Styles.modifyProfilStyle}
              placeholder="Numéro de Siret"
            />
          </CardItem>
        </Card>
        <Separator />
        <Card transparent>
          <CardItem style={Styles.cardItemModify}>
            <Thumbnail
              small
              style={Styles.thumbnailWithMargin}
              source={{
                uri: `https://cdn0.iconfinder.com/data/icons/logistic-delivery-2-5/128/52-256.png`,
              }}
            />
            <Autocomplete
              placeholder="Adresse du commerce"
              value={this.state.adressInput}
              onChangeText={(value) => this.handleAdressChange(value)}
              data={this.state.autoCompleteAdressLabel}
              keyExtractor={(item) => item.properties.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      adressInput: item.properties.label,
                      autoCompleteAdressLabel: [],
                      address: item,
                    });
                  }}
                >
                  <Text>{item.properties.label}</Text>
                </TouchableOpacity>
              )}
            />
          </CardItem>
        </Card>
        <Separator />
        {this.state.error ? (
          <View>
            {this.state.error.map((error, index) => (
              <Text key={index} style={Styles.textError}>
                {`${error}`}
              </Text>
            ))}
            {this.state.error[0] ? <Separator /> : null}
          </View>
        ) : null}
        {!this.state.pending ? (
          <Button
            rounded
            block
            style={Styles.buttonSign}
            onPress={() => this.handleClickStepThree()}
          >
            <Text style={Styles.textChoiceStyle}>Valider</Text>
          </Button>
        ) : (
          <Spinner />
        )}
        {/* <TouchableOpacity onPress={()=>this.handleClick()}>
								<Text style={styles.button}>Valider</Text>
							</TouchableOpacity> */}
      </View>
    );
  };

  render() {
    if (this.state.step === 1) return <View>{this.stepOne()}</View>;
    if (this.state.step === 2) return this.stepTwo();
    if (this.state.step === 3) return <View>{this.stepThree()}</View>;
  }
}

const Separator = (props) => (
  <View style={{ marginVertical: props.value || 8 }} />
);

const styles = StyleSheet.create({
  welcome: {
    marginTop: 40,
    marginBottom: 50,
  },
  content: {
    marginTop: 20,
  },
  backgroundImage: {
    position: "absolute",
    resizeMode: "stretch",
    flex: 1,
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
  },
  container: {
    justifyContent: "center",
    marginHorizontal: 10,
    marginTop: 30,
  },
  h1: {
    fontSize: 20,
    alignSelf: "center",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "orange",
    alignSelf: "center",
    marginTop: "10%",
    borderWidth: 1,
    borderColor: "black",
  },
  card: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    flex: 1,
    textAlignVertical: "center",
    textAlign: "center",
    zIndex: 200,
  },
  content: {
    marginTop: 20,
  },
  background: {
    width: "100%",
    height: "100%",
  },
  h1: {
    fontSize: 20,
    alignSelf: "center",
    fontWeight: "bold",
  },
  ImageBackground: {
    height: 100,
    width: null,
    flex: 1,
    zIndex: 1,
  },
  welcome: {
    marginTop: 40,
    marginBottom: 50,
  },
  content: {
    marginTop: 20,
  },
  backgroundImage: {
    position: "absolute",
    resizeMode: "stretch",
    flex: 1,
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
  },
  container: {
    justifyContent: "center",
    marginHorizontal: 10,
    marginTop: 30,
  },
  h1: {
    fontSize: 20,
    alignSelf: "center",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "orange",
    color: "white",
    width: "55%",
    borderRadius: 25,
    textAlign: "center",
    alignSelf: "center",
    fontWeight: "bold",
    padding: "2%",
    fontSize: 25,
    marginTop: "10%",
  },
});
