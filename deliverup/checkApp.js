import React, { Component } from "react";
import { AppState, StyleSheet, Text, View } from "react-native";

class AppStateExample extends Component {
  state = {
    appState: AppState.currentState
  };
  componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);
  }
  
  _handleAppStateChange = nextAppState => {
    console.log(AppState.currentState)
    this.setState({ appState: nextAppState });
  };
  
  render() {
    return (
      <View style={styles.container}>
        <Text>Current state is: {this.state.appState}</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
export default AppStateExample;