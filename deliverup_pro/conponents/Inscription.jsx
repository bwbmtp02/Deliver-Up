import React from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import { Container, Button, Text, Spinner } from "native-base";
import { Actions } from "react-native-router-flux";
import * as Font from "expo-font";

class Inscription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
    });
    this.setState({ loading: false });
  }

  render() {
    if (!this.state.loading) {
      return (
        <Container
          style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <ImageBackground
            source={require("../images/velo.jpg")}
            style={{ width: "100%", height: "100%" }}
            blurRadius={5}
          >
            {/* <Content style={{borderWidth: 1, borderColor: 'black'}}> */}
            <View
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "black",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={styles.h1}>Inscription</Text>
              <Text style={styles.h1}>Je suis...</Text>
              <Button
                rounded
                style={styles.button}
                onPress={() => {
                  const data = {
                    email: this.props.email,
                    password: this.props.password,
                  };
                  Actions.inscriptionCommercant(data);
                }}
              >
                <Text style={{ fontSize: 25 }}>Commerçant</Text>
              </Button>
              <Button rounded style={styles.button}>
                <Text style={{ fontSize: 25 }}>Particulier</Text>
              </Button>
            </View>
            {/* </Content> */}
          </ImageBackground>
        </Container>
      );
    } else {
      return <Spinner />;
    }
  }
}

export default Inscription;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "orange",
    alignSelf: "center",
    marginTop: "10%",
    borderWidth: 1,
    borderColor: "black",
  },
  background: {
    width: "100%",
    height: "100%",
  },
  h1: {
    fontSize: 20,
    alignSelf: "center",
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "black",
  },
  text: {
    fontSize: 20,
    alignSelf: "center",
    marginTop: 10,
    color: "white",
    borderWidth: 1,
    borderColor: "black",
  },
});
