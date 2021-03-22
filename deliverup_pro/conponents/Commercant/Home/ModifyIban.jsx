// ================== IMPORT REACT MODULES & ENVIRONMENT VARIABLES ====================
import React, { Component } from "react";
import { StyleSheet, View, Keyboard } from "react-native";
import { Item, Input, Icon, Title, Button, Text } from "native-base";

import axios from "react-native-axios";
import { URL_API } from "../../../env";

// ================== MODIFY PASSWORD CLASS COMPONENT ====================
export default class ModifyIban extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        icon: "eye-off",
        password: true,
        newIban: "",
        confirmPassword: "",
        error: [],
        success: "",
      });
  }

  _changeIcon() {
    this.setState((prevState) => ({
      icon: prevState.icon === "eye" ? "eye-off" : "eye",
      password: !prevState.password,
    }));
  }

  handleModifyIban = async () => {
    this.setState({ success: "" });
    Keyboard.dismiss();
    const error = [];
    if (this.state.newIban === "") error.push("Veuillez taper votre IBAN");
    if (this.state.confirmPassword === "")
      error.push("Veuillez taper votre mot de passe");
    if (!error[0]) {
      const data = {
        IBAN: this.state.newIban,
        password: this.state.confirmPassword,
      };
      await axios
        .patch(
          `${URL_API}/api/merchant/update/iban/${this.props.merchantId}`,
          data
        )
        .then((res) => {
          if (res.data.error) {
            error.push("Mot de passe est incorrect");
          } else {
            this.setState({ success: "Votre IBAN a été mis à jour" });
          }
        })
        .catch((err) => {
          console.error(`Error at updating IBAN (ModifyIban) : ${err}`);
          error.push("Erreur serveur, essayez ultérieurment");
        });
    }
    this.setState({ error });
  };

  render() {
    return (
      <View>
        <Separator />
        <Title style={styles.head}>Modifier mon IBAN</Title>
        <Separator />
        {/* NEW IBAN */}
        <Item rounded style={styles.itemStyle}>
          <Icon active name="lock" style={styles.iconView} />
          <Input
            style={styles.textStyle}
            placeholder="Nouveau IBAN"
            autoCapitalize="none"
            onChangeText={(text) => this.setState({ newIban: text })}
          />
        </Item>
        <Separator />
        {/* CONFIRM PASSWORD */}
        <Item rounded style={styles.itemStyle}>
          <Icon active name="lock" style={styles.iconView} />
          <Input
            style={styles.textStyle}
            placeholder="Mot de passe"
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
          onPress={() => this.handleModifyIban()}
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
