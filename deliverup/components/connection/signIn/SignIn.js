// ================== IMPORT REACT MODULES & ENVIRONMENT VARIABLES ====================
import React, { Component } from "react";
import { View, Keyboard, TouchableOpacity } from "react-native";
import {
  Title,
  Button,
  Text,
  Input,
  Card,
  CardItem,
  Thumbnail,
} from "native-base";
import axios from "axios";
import { URL_API } from "../../../env";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import Styles from "./../../../Style";

// ================== SIGN IN CLASS COMPONENT ====================
export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      enterPassword: true,
      mail: "",
      error: [],
    };
  }

  handleUserConnection = async () => {
    Keyboard.dismiss();
    const error = [];
    const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    this.state.mail == ""
      ? error.push("Veuillez renseigner votre email")
      : null;
    this.state.password == ""
      ? error.push("Veuillez renseigner votre mot de passe")
      : null;
    if (this.state.mail != "") {
      if (re.test(this.state.mail) == false) {
        error.push("Veuillez renseigner une adresse email valide");
      }
    }
    this.setState({
      error: error,
    });
    if (!error[0]) {
      const login = { email: this.state.mail, password: this.state.password };
      await axios.post(`${URL_API}/api/login/user`, login).then((res) => {
        if (res.data === "Email or Password is wrong") {
          error.push("La combinaison email et mot de passe ne correspond pas");
          this.setState({ error });
        } else {
          if (res.data.error) {
            error.push(
              "La combinaison email et mot de passe ne correspond pas"
            );
            this.setState({ error });
          } else {
            this.props.setConnection(res.data);
          }
        }
      });
    }
  };

  _changeIcon() {
    this.setState((prevState) => ({
      enterPassword: !prevState.enterPassword,
    }));
  }

  render() {
    return (
      <View>
        <Separator />
        <Title style={Styles.titleStyle}>Connexion</Title>
        <Separator />
        <Card transparent>
          <CardItem style={Styles.cardItemModify}>
            <Thumbnail
              square
              small
              source={{
                uri: `https://cdn4.iconfinder.com/data/icons/twitter-ui-set/128/Mail-512.png`,
              }}
            />
            <Input
              style={Styles.modifyProfilStyle}
              placeholder="Adresse mail"
              autoCapitalize="none"
              autoCompleteType="email"
              textContentType="emailAddress"
              keyboardType="email-address"
              autoCorrect={false}
              onChangeText={(text) => this.setState({ mail: text })}
            />
          </CardItem>
          <Separator />
          <CardItem style={Styles.cardItemModify}>
            <Thumbnail
              square
              small
              source={{
                uri: `https://cdn1.iconfinder.com/data/icons/internet-security-3/64/x-01-512.png`,
              }}
            />
            <Input
              style={Styles.modifyProfilStyle}
              placeholder="Mot de passe"
              autoCapitalize="none"
              secureTextEntry={this.state.enterPassword}
              onChangeText={(text) => this.setState({ password: text })}
            />
            <TouchableOpacity onPress={() => this._changeIcon()}>
              <Thumbnail
                small
                source={{
                  uri: `https://cdn0.iconfinder.com/data/icons/user-interface-198/64/show-password-interface-ui-512.png`,
                }}
                style={
                  this.state.enterPassword === false
                    ? Styles.colorThumbnailOff
                    : null
                }
              />
            </TouchableOpacity>
          </CardItem>
        </Card>
        <Separator />
        <Button
          rounded
          block
          onPress={() => this.handleUserConnection()}
          style={Styles.buttonSign}
        >
          <Text style={Styles.textChoiceStyle}> Confirmer </Text>
        </Button>
        <Separator />
        {this.state.error[0]
          ? this.state.error.map((error, index) => (
              <Text
                key={index}
                style={{
                  color: "red",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {error}
              </Text>
            ))
          : null}
      </View>
    );
  }
}

// ================== STYLE COMPONENT ====================
const Separator = () => <View style={{ marginVertical: 8 }} />;
