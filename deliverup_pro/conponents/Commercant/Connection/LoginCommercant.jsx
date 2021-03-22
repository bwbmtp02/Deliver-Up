import React from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import {
  Spinner,
  Button,
  Text,
  Input,
  Title,
  CardItem,
  Card,
  Thumbnail,
} from "native-base";
import * as Font from "expo-font";
import axios from "react-native-axios";
import { URL_API } from "../../../env";
import Styles from "../../Styles";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      pending: false,
      enterPassword: true,
      email: "",
      password: "",
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

  handleLogin = async () => {
    const error = [];
    const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    this.state.email == ""
      ? error.push("Veuillez renseigner votre email")
      : null;
    if (this.state.email != "" && !re.test(this.state.email) === true)
      error.push("Veuillez renseigner une adresse email valide");
    this.state.password == ""
      ? error.push("Veuillez taper votre mot de passe")
      : null;

    if (!error[0]) {
      this.setState({ pending: true });
      await axios
        .post(`${URL_API}/api/login/merchant`, {
          email: this.state.email,
          password: this.state.password,
        })
        .then((res) => {
          if (res.data.merchantId) {
            this.setState({ pending: false });
            this.props.setConnection(res.data);
          } else {
            error.push("La combinaison Email/Mot de passe ne correspond pas");
            this.setState({ error, pending: false });
          }
          // this.setState({ pending: false })
        })
        .catch((err) =>
          console.error(`Merchant Login failed (Login.js) : ${err}`)
        );
      // this.setState({ pending: false })
    }
    // this.setState({error})
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
          <Title style={Styles.titleStyle}>Connexion</Title>
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
                autoCompleteType="password"
                textContentType="password"
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
          </Card>

          {this.state.error[0]
            ? this.state.error.map((error, index) => (
                <Text key={index} style={{ color: "red", fontSize: 20 }}>
                  {`${error}`}
                </Text>
              ))
            : null}
          <Separator />
          {this.state.pending == false ? (
            <Button
              rounded
              block
              onPress={() => this.handleLogin()}
              style={Styles.buttonSign}
            >
              <Text style={Styles.textChoiceStyle}>Connexion</Text>
            </Button>
          ) : (
            <Spinner color="#3D0814" />
          )}
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
  containerView: {
    // justifyContent: 'center',
    backgroundColor: "#B3B3B3",
    height: "100%",
  },
  container: {
    justifyContent: "center",
    marginHorizontal: 10,
  },
  error: {
    marginVertical: 5,
    color: "red",
  },
  backgroundImage: {
    position: "absolute",
    left: 0,
    top: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
