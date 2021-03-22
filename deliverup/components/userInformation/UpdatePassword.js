// ================== IMPORT REACT MODULES & ENVIRONMENT VARIABLES ====================
import React, { Component } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import {
  Input,
  Title,
  Button,
  Text,
  Card,
  CardItem,
  Thumbnail,
  Spinner,
} from "native-base";
import axios from "axios";
import { Actions } from "react-native-router-flux";
import { URL_API } from "../../env";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import Styles from "../../Style";

// ================== UPDATE PASSWORD CLASS COMPONENT ====================
export default class UpdatePassword extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        icon: "eye-off",
        password: true,
        validated: false,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        error: [],
        loading: false,
      });
  }

  // ========= Methods to handle errors ===========
  customErrorMsg = () => {
    if (this.state.error[0]) {
      return this.state.error.map((error, index) => (
        <Text key={index} style={Styles.textError}>
          {error}
        </Text>
      ));
    }
  };

  // ========= Methods to send a confirmation msg ===========
  customValidMsg = () => {
    if (this.state.validated == true) {
      return (
        <Text style={Styles.textValidated}>
          Le mot de passe a bien été modifié
        </Text>
      );
    }
  };

  // ========= Loading spinner ===========
  waitForResponse = () => {
    if (this.state.loading == true) {
      return <Spinner />;
    }
  };

  // ========= Change icon & make password visible ===========
  _changeIcon() {
    this.setState((prevState) => ({
      password: !prevState.password,
    }));
  }

  // ========= Alert before patch ===========
  alertConfirm = () => {
    if (
      this.state.currentPassword !== "" &&
      this.state.newPassword !== "" &&
      this.state.confirmPassword !== ""
    ) {
      Alert.alert(
        "Modifier le mot de passe",
        `Valider pour modifier votre mot de passe`,
        [
          {
            text: "Annuler",
            style: "cancel",
          },
          {
            text: "Valider",
            onPress: () => this.handleUpdatePassword(),
          },
        ],
        { cancelable: false }
      );
    } else {
      const error = ["Veuillez completer tous les champs"];
      this.setState({ error });
    }
  };

  // ========= Method to check & patch password ===========
  handleUpdatePassword = async () => {
    const error = [];
    this.setState({ validated: false });
    // Check passwords input first
    this.state.newPassword !== this.state.confirmPassword
      ? error.push("Veuillez renseigner deux mots de passes identiques")
      : null;
    this.setState({ error });

    // If no error, time to verify current password and patch
    if (!error[0]) {
      this.setState({ loading: true });
      const data = {
        password: this.state.currentPassword,
        newPassword: this.state.newPassword,
      };
      await axios
        .patch(`${URL_API}/api/user/update/password/${this.props.userId}`, data)
        .then((res) => {
          if (res.data.error) {
            error.push("Le mot de passe est invalide");
            this.setState({ error, loading: false });
          } else {
            this.setState({ validated: true, loading: false });
            setTimeout(Actions.UserInformation, 1500);
          }
        })
        .catch((err) => console.error(err));
    }
  };

  render() {
    return (
      <View>
        <Separator />
        <Title style={Styles.titleStyle}>Modifier le mot de passe</Title>
        <Separator />
        {/* ACTUAL PASSWORD */}
        <Card transparent>
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
              placeholder="Mot de passe actuel"
              autoCapitalize="none"
              secureTextEntry={this.state.password}
              onChangeText={(text) => this.setState({ currentPassword: text })}
            />
            <TouchableOpacity onPress={() => this._changeIcon()}>
              <Thumbnail
                small
                source={{
                  uri: `https://cdn0.iconfinder.com/data/icons/user-interface-198/64/show-password-interface-ui-512.png`,
                }}
                style={
                  this.state.password === false
                    ? Styles.colorThumbnailOff
                    : null
                }
              />
            </TouchableOpacity>
          </CardItem>
          <Separator />
          {/* NEW PASSWORD */}
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
              placeholder="Nouveau mot de passe"
              autoCapitalize="none"
              secureTextEntry={this.state.password}
              onChangeText={(text) => this.setState({ newPassword: text })}
            />
            <TouchableOpacity onPress={() => this._changeIcon()}>
              <Thumbnail
                small
                source={{
                  uri: `https://cdn0.iconfinder.com/data/icons/user-interface-198/64/show-password-interface-ui-512.png`,
                }}
                style={
                  this.state.password === false
                    ? Styles.colorThumbnailOff
                    : null
                }
              />
            </TouchableOpacity>
          </CardItem>
          <Separator />
          {/* CONFIRM NEW PASSWORD */}
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
              placeholder="Confirmer nouveau mot de passe"
              autoCapitalize="none"
              secureTextEntry={this.state.password}
              onChangeText={(text) => this.setState({ confirmPassword: text })}
            />
            <TouchableOpacity onPress={() => this._changeIcon()}>
              <Thumbnail
                small
                source={{
                  uri: `https://cdn0.iconfinder.com/data/icons/user-interface-198/64/show-password-interface-ui-512.png`,
                }}
                style={
                  this.state.password === false
                    ? Styles.colorThumbnailOff
                    : null
                }
              />
            </TouchableOpacity>
          </CardItem>
        </Card>
        <Separator />
        {this.customErrorMsg()}
        {this.customValidMsg()}
        {this.waitForResponse()}
        <Separator />
        {/* CONFIRMATION */}
        <Button
          rounded
          block
          style={Styles.cardItemFooterProfile}
          onPress={() => this.alertConfirm()}
        >
          <Text style={Styles.textChoiceStyle}> Confirmer </Text>
        </Button>
      </View>
    );
  }
}

// ================== STYLE COMPONENT ====================
const Separator = () => <View style={{ marginVertical: 8 }} />;
