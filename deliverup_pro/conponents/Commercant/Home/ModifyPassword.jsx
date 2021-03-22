// ================== IMPORT REACT MODULES & ENVIRONMENT VARIABLES ====================
import React, { Component } from "react";
import { StyleSheet, View, Keyboard } from "react-native";
import { Item, Input, Icon, Title, Button, Text } from "native-base";

import axios from "react-native-axios";
import { URL_API } from "../../../env";

// ================== MODIFY PASSWORD CLASS COMPONENT ====================
export default class ModifyPassword extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        icon: "eye-off",
        password: true,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        error: [],
      });
  }

  _changeIcon() {
    this.setState((prevState) => ({
      icon: prevState.icon === "eye" ? "eye-off" : "eye",
      password: !prevState.password,
    }));
  }

  handleModifyPassword = async () => {
    Keyboard.dismiss();
    const error = [];
    if (this.state.newPassword !== this.state.confirmPassword)
      error.push("Veuillez faire correspondre les mots de passe");
    if (!error[0]) {
      const data = {
        password: this.state.oldPassword,
        newPassword: this.state.newPassword,
      };
      await axios
        .patch(
          `${URL_API}/api/merchant/update/password/${this.props.merchantId}`,
          data
        )
        .then((res) => {
          console.log(res.data, "response");
          if (res.data.error) {
            error.push("Ancien mot de passe invalide");
          } else {
            this.setState({ success: "Votre mot de passe à été mise à jour" });
          }
        })
        .catch((err) => {
          console.error(`Error at updating password : ${err.message}`);
        });
    }
    this.setState({ error });
  };

  render() {
    return (
      <View>
        <Separator />
        <Title style={styles.head}>Modifier le mot de passe</Title>
        <Separator />
        {/* ACTUAL PASSWORD */}
        <Item rounded style={styles.itemStyle}>
          <Icon active name="lock" style={styles.iconView} />
          <Input
            style={styles.textStyle}
            placeholder="Mot de passe actuel"
            secureTextEntry={this.state.password}
            autoCapitalize="none"
            onChangeText={(text) => this.setState({ oldPassword: text })}
          />
          <Icon
            name={this.state.icon}
            onPress={() => this._changeIcon()}
            style={styles.iconView}
          />
        </Item>
        <Separator />
        {/* NEW PASSWORD */}
        <Item rounded style={styles.itemStyle}>
          <Icon active name="lock" style={styles.iconView} />
          <Input
            style={styles.textStyle}
            placeholder="Nouveau mot de passe"
            autoCapitalize="none"
            secureTextEntry={this.state.password}
            onChangeText={(text) => this.setState({ newPassword: text })}
          />
          <Icon
            name={this.state.icon}
            onPress={() => this._changeIcon()}
            style={styles.iconView}
          />
        </Item>
        <Separator />
        {/* CONFIRM NEW PASSWORD */}
        <Item rounded style={styles.itemStyle}>
          <Icon active name="lock" style={styles.iconView} />
          <Input
            style={styles.textStyle}
            placeholder="Confirmer mot de passe"
            autoCapitalize="none"
            secureTextEntry={this.state.password}
            onChangeText={(text) => this.setState({ confirmPassword: text })}
          />
          <Icon
            name={this.state.icon}
            onPress={() => this._changeIcon()}
            style={styles.iconView}
          />
        </Item>
        <Separator />
        {/* CONFIRMATION */}
        <Button
          rounded
          block
          onPress={() => this.handleModifyPassword()}
          style={styles.customButton}
        >
          <Text style={styles.textButtonStyle}> Confirmer </Text>
        </Button>
        {this.state.error
          ? this.state.error.map((error, index) => (
              <Text key={index} style={{ color: "red", fontSize: 20 }}>
                {error}
              </Text>
            ))
          : null}
        {this.state.success !== "" ? (
          <Text style={{ color: "green", fontSize: 20 }}>
            {this.state.success}
          </Text>
        ) : null}
      </View>
    );
  }
}

// ================== STYLE COMPONENT & STYLE VARIABLE ====================
const Separator = () => <View style={{ marginVertical: 8 }} />;

const styles = StyleSheet.create({
  head: {
    color: "lightgrey",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#17212b",
  },
  itemStyle: {
    width: "80%",
    alignSelf: "center",
  },
  textStyle: {
    color: "lightgrey",
  },
  iconView: {
    fontSize: 22,
    color: "lightgrey",
  },
  customButton: {
    backgroundColor: "orange",
  },
  textButtonStyle: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});
