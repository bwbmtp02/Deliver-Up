import React from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import axios from "react-native-axios";
import {
  Card,
  CardItem,
  Button,
  Input,
  Thumbnail,
  Text,
  Title,
  Container,
} from "native-base";
import { Actions } from "react-native-router-flux";
import Autocomplete from "react-native-autocomplete-input";
import * as Font from "expo-font";

import Loader from "../../Loader";
import Styles from "../../Styles";

export default class InscriptionCommercant1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      adressInput: "",
      autoCompleteAdressLabel: [],
      entreprise: "",
      lastname: "",
      phone: "",
      address: "",
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
  // componentDidUpdate(){
  //   console.log(this.props)
  // }

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

  handleClick = () => {
    const error = [];
    this.state.entreprise == ""
      ? error.push("Veuillez entrer le nom de votre entreprise")
      : null;
    this.state.lastname == ""
      ? error.push("Veuillez entrer votre nom de famille")
      : null;
    this.state.phone == ""
      ? error.push("Veuillez entrer votre numéro de téléphone")
      : null;
    this.state.address == ""
      ? error.push("Veuillez entre une adresse valide")
      : null;
    this.setState({ error });
    if (!error[0]) {
      this.handleSubmit();
    }
  };

  handleSubmit = () => {
    const data = {
      //foodshop: true,
      //category: "Boulangerie",
      lastname: this.state.lastname,
      entreprise: this.state.entreprise,
      address: {
        number: this.state.address.properties.housenumber,
        street: this.state.address.properties.street,
        zipcode: this.state.address.properties.postcode,
        city: this.state.address.properties.city,
        lat: this.state.address.geometry.coordinates[1],
        lng: this.state.address.geometry.coordinates[0],
      },
      email: this.props.email,
      phone: this.state.phone,
      password: this.props.password,
      //IBAN: 'oui',
      //siret_number: 'siret'
    };
    // console.log(data)
    // console.log(this.props)
    Actions.inscriptionCommercant2(data);
  };

  render() {
    const data = this.state.autoCompleteAdressLabel;
    if (!this.state.loading) {
      return (
        <Container>
          {/* <Content> */}
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
                  onChangeText={(entreprise) => this.setState({ entreprise })}
                  autoCorrect={false}
                  style={Styles.modifyProfilStyle}
                  placeholder="Nom de l'entreprise"
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
            <Card transparent>
              <CardItem style={Styles.cardItemModify}>
                <Thumbnail
                  small
                  style={Styles.thumbnailWithMargin}
                  source={{
                    uri: `https://cdn1.iconfinder.com/data/icons/flat-business-icons/128/user-512.png`,
                  }}
                />
                <Autocomplete
                  placeholder="Adresse"
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

            <Button
              rounded
              onPress={() => this.handleClick()}
              style={styles.button}
            >
              <Text style={{ fontSize: 25, color: "white" }}> Continuer </Text>
            </Button>
            {this.state.error
              ? this.state.error.map((error, index) => (
                  <Text key={index}>{`${error}`}</Text>
                ))
              : null}
          </View>
          {/* </Content> */}
        </Container>
      );
    } else {
      return <Loader />;
    }
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
});
