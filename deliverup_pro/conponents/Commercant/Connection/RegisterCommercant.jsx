import React from "react";
import { ImageBackground, StyleSheet, Dimensions, View } from "react-native";
import {
  Spinner,
  Card,
  CardItem,
  Button,
  Text,
  Title,
  Input,
  Item,
  Label,
  Thumbnail,
} from "native-base";
import { Actions } from "react-native-router-flux";
import * as Font from "expo-font";
import axios from "react-native-axios";
import { URL_API } from "../../../env";

import Styles from "../../Styles";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      pending: false,
      enterPassword: true,
      email: "",
      password: "",
      confirmPassword: "",
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

  handleRegister = async () => {
    const error = [];
    const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    // console.log(this.state.email)
    if (!re.test(this.state.email))
      error.push("Veuillez renseigner une adresse email valide");
    if (this.state.email == "") error.push("Veuillez renseigner votre Email");
    if (this.state.password == "") error.push("Veuillez taper un mot de passe");
    if (this.state.password !== this.state.confirmPassword)
      error.push("Les mots de passe ne correspondent pas");
    if (this.state.email !== "") {
      this.setState({ pending: true });
      await axios
        .get(`${URL_API}/api/merchant/profile/email/${this.state.email}`)
        .then((res) => {
          console.log(res.data);
          if (!res.data.error) error.push("L'adresse email est déjà utilisée");
        })
        .catch((err) => {
          console.error(`Error at getting email validity : ${err}`);
          error.push("Something went wrong");
        });
      this.setState({ pending: false });
    }
    this.setState({ error });
    if (!error[0]) {
      const data = {
        email: this.state.email,
        password: this.state.password,
      };
      // console.log(data)
      Actions.inscriptionCommercant(data);
    }
  };

  _changeIcon() {
    this.setState((prevState) => ({
      enterPassword: !prevState.enterPassword,
    }));
  }

  render() {
    if (!this.state.loading) {
      return (
        <View style={Styles.containerView}>
          <Separator />
          <Title style={Styles.titleStyle}>S'enregistrer</Title>
          <Separator />

          <Card transparent>
            <CardItem style={Styles.cardItemModify}>
              <Thumbnail
                square
                small
                source={require("../../../assets/mail.png")}
                style={{ marginRight: "2%" }}
              />
              <Input
                placeholder="Adresse mail"
                style={Styles.modifyProfilStyle}
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={(value) => this.setState({ email: value })}
              />
            </CardItem>
            <Separator />
            <CardItem style={Styles.cardItemModify}>
              <Thumbnail
                square
                small
                source={require("../../../assets/padlock.png")}
                style={{ marginRight: "2%" }}
              />
              <Input
                placeholder="Mot de passe"
                style={Styles.modifyProfilStyle}
                secureTextEntry={this.state.enterPassword}
                autoCapitalize="none"
                onChangeText={(value) => this.setState({ password: value })}
              />
              <TouchableOpacity onPress={() => this._changeIcon()}>
                <Thumbnail
                  small
                  source={require("../../../assets/showPassword.png")}
                  style={
                    this.state.enterPassword === false
                      ? Styles.colorThumbnailOff
                      : null
                  }
                />
              </TouchableOpacity>
            </CardItem>
            <Separator />
            <CardItem style={Styles.cardItemModify}>
              <Thumbnail
                square
                small
                source={require("../../../assets/padlock.png")}
                style={{ marginRight: "2%" }}
              />
              <Input
                placeholder="Confirmer mot de passe"
                style={Styles.modifyProfilStyle}
                secureTextEntry={this.state.enterPassword}
                autoCapitalize="none"
                onChangeText={(value) =>
                  this.setState({ confirmPassword: value })
                }
              />
              <TouchableOpacity onPress={() => this._changeIcon()}>
                <Thumbnail
                  small
                  source={require("../../../assets/showPassword.png")}
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
          {this.state.error
            ? this.state.error.map((error, index) => (
                <Text key={index} style={{ color: "red", fontSize: 20 }}>
                  {`${error}`}
                </Text>
              ))
            : null}
          {!this.state.pending ? (
            <Button
              rounded
              block
              onPress={() => this.handleRegister()}
              style={Styles.buttonSign}
            >
              <Text style={Styles.textChoiceStyle}>S'inscrire</Text>
            </Button>
          ) : (
            <Spinner />
          )}

          {/* ------------------ Vue sur le state ----------------------- */}
          {/* <Text>{JSON.stringify(this.state)}</Text> */}
        </View>
      );
    } else {
      return <Spinner />;
    }
  } // END OF RENDER
} // END OF CLASS

const Separator = (props) => (
  <View style={{ marginVertical: props.value || 8 }} />
);

const styles = StyleSheet.create({
  backgroundImage: {
    position: "absolute",
    resizeMode: "stretch",
    flex: 1,
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
  },
  containerView: {
    // justifyContent: 'center',
    backgroundColor: "#B3B3B3",
    height: "100%",
  },
});
