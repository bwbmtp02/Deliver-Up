import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Bars } from "react-native-loader";

export default class Loader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    return (
      <View style={styles.containerView}>
        <View style={styles.viewStyle}>
          <Bars size={50} color="orange" />
        </View>
        <Separator />
        <View style={styles.viewStyle}>
          <Text style={styles.textStyle}>
            Chargement, veuillez patienter...
          </Text>
        </View>
      </View>
    );
  };
}

const Separator = () => <View style={{ marginVertical: 8 }} />;
const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "cover",
  },
  containerView: {
    justifyContent: "center",
    backgroundColor: "#8C5E58",
    height: "100%",
  },
  viewStyle: {
    alignSelf: "center",
  },
  textStyle: {
    color: "white",
    fontSize: 20,
  },
  backgroundImage: {
    position: "absolute",
    resizeMode: "stretch",
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
