import React from "react";
import { StyleSheet, ImageBackground, Dimensions } from "react-native";
import axios from "react-native-axios";
import {
  Container,
  Content,
  Form,
  Item,
  Label,
  Input,
  Button,
  Spinner,
  Text,
} from "native-base";
import { Actions } from "react-native-router-flux";
import * as Font from "expo-font";
import { URL_API } from "../../../env";

export default class InscriptionCommercant3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      pending: false,
      iban: "",
      siret: "",
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

  handleClick = () => {
    const error = [];
    this.state.iban == ""
      ? error.push("Veuillez entrer votre numero IBAN")
      : null;
    this.state.siret == ""
      ? error.push("Veuillez entrer votre numéro de Siret")
      : null;
    this.setState({ error });
    if (!error[0]) {
      this.handleFinalSubmit();
    }
  };

  handleFinalSubmit = async () => {
    const data = {
      foodShop: this.props.foodShop,
      category: this.props.category,
      enterprise: this.props.entreprise,
      name: this.props.lastname,
      address: {
        number: this.props.address.number,
        street: this.props.address.street,
        zipcode: this.props.address.zipcode,
        city: this.props.address.city,
      },
      location: [this.props.address.lat, this.props.address.lng],
      phone: this.props.phone,
      email: this.props.email,
      password: this.props.password,
      IBAN: this.state.iban,
      siretNumber: this.state.siret,
    };

    this.setState({ pending: true });
    console.log(data, "from inscription3");
    await axios
      .post(`${URL_API}/api/merchant/new`, data)
      .catch((err) =>
        console.error(
          `Error at creating new merchant from Inscription3 : ${err}`
        )
      );

    const login = {
      email: data.email,
      password: data.password,
    };

    // console.log(this.props.connect)
    await axios
      .post(`${URL_API}/api/login/merchant`, login)
      .then((res) => {
        this.setState({ pending: false });
        this.props.setConnection(res.data);
      })
      .catch((err) =>
        console.error(`Login Error at API_DATA from Inscription3 : ${err}`)
      );
  };

  render() {
    if (!this.state.loading) {
      return (
        <Container>
          <ImageBackground
            source={require("../../../images/velo.jpg")}
            style={styles.backgroundImage}
            blurRadius={5}
          >
            <Content>
              <Text style={styles.h1}>On y est presque !</Text>
              <Form>
                <Item floatingLabel>
                  <Label>IBAN</Label>
                  <Input onChangeText={(iban) => this.setState({ iban })} />
                </Item>
                <Item floatingLabel>
                  <Label>Numéro de siret</Label>
                  <Input onChangeText={(siret) => this.setState({ siret })} />
                </Item>
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
                    onPress={() => this.handleClick()}
                    style={{ alignSelf: "center" }}
                  >
                    <Text>Connexion</Text>
                  </Button>
                ) : (
                  <Spinner />
                )}
                {/* <TouchableOpacity onPress={()=>this.handleClick()}>
                  <Text style={styles.button}>Valider</Text>
                </TouchableOpacity> */}
              </Form>
            </Content>
          </ImageBackground>
        </Container>
      );
    } else {
      return <Spinner />;
    }
  }
}

const styles = StyleSheet.create({
  welcome: {
    marginTop: 40,
    marginBottom: 50,
  },
  content: {
    marginTop: 20,
  },
  backgroundImage: {
    position: "absolute",
    resizeMode: "stretch",
    flex: 1,
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
  },
  container: {
    justifyContent: "center",
    marginHorizontal: 10,
    marginTop: 30,
  },
  h1: {
    fontSize: 20,
    alignSelf: "center",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "orange",
    color: "white",
    width: "55%",
    borderRadius: 25,
    textAlign: "center",
    alignSelf: "center",
    fontWeight: "bold",
    padding: "2%",
    fontSize: 25,
    marginTop: "10%",
  },
});
