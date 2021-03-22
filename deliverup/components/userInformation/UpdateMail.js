// ================== IMPORT REACT NATIVE MODULES ====================
import React, { Component } from "react";
import { View, Alert } from "react-native";
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
import { URL_API } from "../../env";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import Styles from "../../Style";

// ================== MODIFY MAIL CLASS COMPONENT ====================
export default class UpdateMail extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        newMail: "",
        currentMail: "",
        error: [],
        validated: false,
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
          L'adresse mail a bien été modifiée
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

  // ========= Alert before patch ===========
  alertConfirm = () => {
    if (this.state.currentMail !== "" && this.state.newMail !== "") {
      Alert.alert(
        "Modifier l'adresse mail'",
        `Valider pour modifier votre adresse mail`,
        [
          {
            text: "Annuler",
            style: "cancel",
          },
          {
            text: "Valider",
            onPress: () => this.handleUpdateMail(),
          },
        ],
        { cancelable: false }
      );
    } else {
      const error = ["Veuillez completer tous les champs"];
      this.setState({ error });
    }
  };

  // ========= Method to check & patch mail ===========
  handleUpdateMail = async () => {
    const error = [];
    const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    this.setState({ validated: false, error: [] });
    //Check if currentMail input is the same as mail in user props
    if (this.props.email === this.state.currentMail) {
      this.setState({ loading: true });
      const data = {
        email: this.state.newMail,
      };
      // Check if mail format is correct
      if (re.test(this.state.newMail) == true) {
        // Check if mail already exist in db
        await axios
          .get(`${URL_API}/api/user/profile/email/${this.state.newMail}`)
          .then((res) =>
            res.data.success
              ? (error.push("L'adresse email est déjà utilisée"),
                this.setState({ error, loading: false }))
              : null
          )
          .catch((err) => console.error(err));
        // If no error, time to patch new mail
        if (!error[0]) {
          await axios
            .patch(`${URL_API}/api/user/update/${this.props.userId}`, data)
            .then((res) => {
              this.setState({ validated: true, loading: false });
              setTimeout(this.props.updateInfo, 1500);
            })
            .catch((err) => console.error(err));
        }
      } else {
        error.push("Veuillez renseigner une adresse email valide");
        this.setState({ error, loading: false });
      }
    } else {
      error.push("L'adresse mail actuelle est invalide");
      this.setState({ error, loading: false });
    }
  };

  render() {
    return (
      <View>
        <Separator />
        <Title style={Styles.titleStyle}>Modifier l'adresse mail</Title>
        <Separator />
        {/* ACTUAL MAIL */}
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
              autoCapitalize="none"
              textContentType="emailAddress"
              keyboardType="email-address"
              placeholder="Adresse mail actuelle"
              onChangeText={(text) => this.setState({ currentMail: text })}
            />
          </CardItem>
          <Separator />
          {/* NEW MAIL */}
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
              textContentType="emailAddress"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Nouvelle adresse mail"
              onChangeText={(text) => this.setState({ newMail: text })}
            />
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
