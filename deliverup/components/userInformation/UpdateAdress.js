// ================== IMPORT REACT MODULES & ENVIRONMENT VARIABLES ====================
import React, { Component } from "react";
import { ImageBackground, View, TouchableOpacity, Alert } from "react-native";
import { Title, Button, Text, Card, CardItem, Thumbnail } from "native-base";
import axios from "axios";
import Autocomplete from "react-native-autocomplete-input";
import { URL_API } from "../../env";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import Styles from "./../../Style";

// ================== VARIABLES DECLARATION ====================
const wallpaper = require("../../assets/background.jpg");

// ================== UPDATE ADRESS CLASS COMPONENT ====================
export default class UpdateAdress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      icon: "eye-off",
      adressInput: "",
      error: [],
    };
  }

  _changeIcon() {
    this.setState((prevState) => ({
      icon: prevState.icon === "eye" ? "eye-off" : "eye",
      password: !prevState.password,
    }));
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

  alertConfirm = () => {
    if (this.state.address) {
      Alert.alert(
        "Confirmer nouvelle adresse ?",
        `${this.state.address.properties.label}`,
        [
          {
            text: "Annuler",
            style: "cancel",
          },
          {
            text: "Valider",
            onPress: () => this.handleUpdateAddress(),
          },
        ],
        { cancelable: false }
      );
    } else {
      const error = ["Veuillez taper une adresse valide"];
      this.setState({ error });
    }
  };

  handleUpdateAddress = async () => {
    const data = {
      address: {
        number: this.state.address.properties.housenumber,
        street: this.state.address.properties.street,
        zipcode: this.state.address.properties.postcode,
        city: this.state.address.properties.city,
      },
      location: {
        coordinates: [
          this.state.address.geometry.coordinates[1],
          this.state.address.geometry.coordinates[0],
        ],
      },
    };
    await axios.patch(`${URL_API}/api/user/update/${this.props.userId}`, data);
    this.props.updateInfo();
  };

  render() {
    return (
      <ImageBackground source={wallpaper} style={Styles.image}>
        <Separator />
        <Title style={Styles.titleStyle}>Modifier votre adresse</Title>
        <Separator />
        <Card style={Styles.cardLobby}>
          <CardItem style={Styles.cardItemModify}>
            <Thumbnail
              style={Styles.colorCreamThumbnailWithMargin}
              small
              source={{
                uri: `https://cdn0.iconfinder.com/data/icons/apartments-marketing-color/64/location-512.png`,
              }}
            />
            <Autocomplete
              placeholder="Adresse"
              value={this.state.adressInput}
              onChangeText={(value) => this.handleAdressChange(value)}
              keyExtractor={(item) => item.properties.id}
              data={this.state.autoCompleteAdressLabel}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      adressInput: item.properties.label,
                      autoCompleteAdressLabel: [],
                      address: item,
                      error: [],
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
        <Button
          rounded
          block
          onPress={() => this.alertConfirm()}
          style={Styles.cardItemFooterProfile}
        >
          <Text style={Styles.textChoiceStyle}> Confirmer </Text>
        </Button>
        <Separator />
        <Separator />
        {this.state.error[0]
          ? this.state.error.map((error, key) => (
              <Text style={Styles.textError} key={key}>
                {error}
              </Text>
            ))
          : null}
      </ImageBackground>
    );
  }
}

// ================== STYLE COMPONENT ====================
const Separator = () => <View style={{ marginVertical: 8 }} />;
