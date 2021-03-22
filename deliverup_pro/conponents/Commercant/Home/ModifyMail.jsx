// ================== IMPORT REACT NATIVE MODULES ====================
import React, { Component } from "react";
import { StyleSheet, View, Keyboard } from "react-native";
import { Item, Input, Icon, Title, Button, Text } from "native-base";
import axios from "react-native-axios";
import { URL_API } from "../../../env";

// ================== MODIFY MAIL CLASS COMPONENT ====================
export default class ModifyMail extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        icon: "eye-off",
        email: "",
        success: "",
      });
  }

  _changeIcon() {
    this.setState((prevState) => ({
      icon: prevState.icon === "eye" ? "eye-off" : "eye",
      password: !prevState.password,
    }));
  }

  handleModifyMail = async () => {
    Keyboard.dismiss();
    const error = [];
    const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!re.test(this.state.email))
      error.push("Veuillez renseigner une adresse email valide");
    if (this.state.email === "") error.push("Veuillez renseigner votre Email");
    if (this.state.email !== "") {
      await axios
        .get(`${URL_API}/api/merchant/profile/email/${this.state.email}`)
        .then((res) => {
          console.log(res.data);
          if (res.data.success) error.push("L'adresse email est déjà utilisée");
        })
        .catch((err) => {
          console.error(`Error at getting email validity : ${err}`);
          error.push("Something went wrong");
        });
    }
    this.setState({ error });
    if (!error[0]) {
      const data = {
        email: this.state.email,
      };
      console.log(this.props);
      await axios
        .patch(`${URL_API}/api/merchant/update/${this.props.merchantId}`, data)
        .then((res) => {
          console.log(res.data);
          this.setState({ success: "Votre adresse Email à été mise à jour" });
        })
        .catch((err) => console.error(`Error at updating new mail : ${err}`));
    }
  };

  render() {
    return (
      <View>
        <Separator />
        <Title style={styles.head}>Modifier l'adresse mail</Title>
        <Separator />
        {/* NEW MAIL */}
        <Item rounded style={styles.itemStyle}>
          <Icon active name="email" type="Entypo" style={styles.iconView} />
          <Input
            style={styles.textStyle}
            placeholder="Nouvelle addresse mail"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={(text) => this.setState({ email: text })}
          />
        </Item>
        <Separator />

        <Button
          rounded
          block
          onPress={() => this.handleModifyMail()}
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
