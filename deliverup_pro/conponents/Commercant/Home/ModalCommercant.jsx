import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import { Text, Content, Button, Spinner } from "native-base";
import * as Font from "expo-font";

export default class ModalCommercant extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      visible: true,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
    });
    this.setState({ loading: false });
  }

  setModalVisible = (visible) => {
    this.setState({ visible: visible });
  };

  render() {
    if (this.state.visible) {
      if (!this.state.loading) {
        return (
          <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={() => this.setModalVisible(false)}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Content padder>
                  <Text>Salut mon pote</Text>
                  <Button onPress={() => this.setState({ visible: false })}>
                    <Text>Retour</Text>
                  </Button>
                </Content>
              </View>
            </View>
          </Modal>
        );
      } else {
        return <Spinner />;
      }
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
