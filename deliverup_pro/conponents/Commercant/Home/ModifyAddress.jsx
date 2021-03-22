import React, { Component } from "react";
import { Text, View } from "react-native";
import { Button, Card, CardItem } from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";
import Autocomplete from "react-native-autocomplete-input";
import axios from "react-native-axios";
import { URL_API } from "../../../env";

export default class ModifyAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      adressInput: "",
      autoCompleteAdressLabel: [],
      address: "",
      error: [],
      success: "",
    };
  }

  handleAdressChange = async (value) => {
    this.setState({ adressInput: value });
    if (this.state.adressInput !== "") {
      await axios
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
    this.setState({ success: "" });
    const error = [];
    if (this.state.address == "")
      error.push("Veuillez entre une adresse valide");
    this.setState({ error });
    if (!error[0]) {
      this.handleSubmit();
    }
  };

  handleSubmit = async () => {
    const data = {
      address: {
        number: this.state.address.properties.housenumber,
        street: this.state.address.properties.street,
        zipcode: this.state.address.properties.postcode,
        city: this.state.address.properties.city,
      },
      location: {
        type: "Point",
        coordinates: [
          this.state.address.geometry.coordinates[1],
          this.state.address.geometry.coordinates[0],
        ],
      },
    };

    await axios
      .patch(`${URL_API}/api/merchant/update/${this.props.merchantId}`, data)
      .then((res) => {
        // console.log(res.data)
        this.setState({ success: "Votre adresse à été mise à jour" });
      })
      .catch((err) =>
        console.error(`Error at updating address (modifyAddress) : ${err}`)
      );
  };

  render() {
    return (
      <View>
        {/* <Content> */}
        {/* <Text>salut mon pote</Text> */}
        <Card transparent>
          <CardItem>
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

        <Button onPress={() => this.handleClick()}>
          <Text style={{ fontSize: 25, color: "white" }}> Continuer </Text>
        </Button>
        {this.state.error
          ? this.state.error.map((error, index) => (
              <Text key={index} style={{ color: "red", fontSize: 20 }}>
                {`${error}`}
              </Text>
            ))
          : null}
        {this.state.success !== "" ? (
          <Text style={{ color: "green", fontSize: 20 }}>
            {this.state.success}
          </Text>
        ) : null}
        {/* <Text>
          test
        </Text> */}
        {/* </Content> */}
      </View>
    );
  }
}
