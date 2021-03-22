import React from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import axios from "react-native-axios";
import { Container, Card, CardItem, Thumbnail, Content } from "native-base";
import { Actions } from "react-native-router-flux";
import Autocomplete from "react-native-autocomplete-input";

class Inscriptioncommercant2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [
        {
          name: "Boulangerie",
          foodShop: true,
          imageBackground: require("../../../images/boulangerie.jpg"),
        },
        {
          name: "Epicerie",
          foodShop: true,
          imageBackground: require("../../../images/epicerie.jpeg"),
        },
        {
          name: "Pharmacie",
          foodShop: false,
          imageBackground: require("../../../images/pharmacie.jpg"),
        },
        {
          name: "Boucherie",
          foodShop: true,
          imageBackground: require("../../../images/boucherie.jpg"),
        },
        {
          name: "Fleuriste",
          foodShop: false,
          imageBackground: require("../../../images/fleuriste.jpg"),
        },
        {
          name: "Fromagerie",
          foodShop: true,
          imageBackground: require("../../../images/fromagerie.jpg"),
        },
      ],
    };
  }
  // componentDidUpdate(){
  //   console.log(this.props)
  // }

  render() {
    return (
      <Container
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ImageBackground
          source={require("../../../images/velo.jpg")}
          style={styles.background}
          blurRadius={5}
        >
          <Content>
            <Text style={styles.h1}>Je suis propriétaire de ...</Text>

            {this.state.categories
              ? this.state.categories.map((category, index) => (
                  <Card key={index}>
                    <CardItem cardBody>
                      <ImageBackground
                        source={category.imageBackground}
                        style={styles.ImageBackground}
                      >
                        <TouchableOpacity
                          style={styles.card}
                          onPress={() =>
                            Alert.alert(
                              "Confirmation",
                              `Valider ${category.name} ?`,
                              [
                                {
                                  text: "Annuler",
                                  onPress: () => console.log("Cancel Pressed"),
                                  style: "cancel",
                                },
                                {
                                  text: "Valider",
                                  onPress: () => {
                                    const data = {
                                      foodShop: category.foodShop,
                                      category: category.name,
                                      entreprise: this.props.entreprise,
                                      lastname: this.props.lastname,
                                      address: this.props.address,
                                      email: this.props.email,
                                      phone: this.props.phone,
                                      password: this.props.password,
                                      passwordConfirm: this.props.password,
                                    };
                                    // console.log(data)
                                    Actions.inscriptionCommercant3(data);
                                  },
                                },
                              ],
                              { cancelable: true }
                            )
                          }
                        >
                          <Text style={styles.card}>{`${category.name}`}</Text>
                        </TouchableOpacity>
                      </ImageBackground>
                    </CardItem>
                  </Card>
                ))
              : null}
          </Content>
        </ImageBackground>
      </Container>
    );
  }
}

export default Inscriptioncommercant2;

const styles = StyleSheet.create({
  card: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    flex: 1,
    textAlignVertical: "center",
    textAlign: "center",
  },
  content: {
    marginTop: 20,
  },
  background: {
    width: "100%",
    height: "100%",
  },
  h1: {
    fontSize: 20,
    alignSelf: "center",
    fontWeight: "bold",
  },
  ImageBackground: {
    height: 100,
    width: null,
    flex: 1,
  },
});
