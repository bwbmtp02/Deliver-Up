import React from "react";
import {
  Text,
  Header,
  Left,
  Right,
  Button,
  Body,
  Icon,
  Switch,
  Spinner,
} from "native-base";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import axios from "react-native-axios";
import { URL_API, URL_ORDERS } from "../../../env";
import { Actions } from "react-native-router-flux";

// Import socket
import { io } from "socket.io-client";
import Styles from "../../Styles";

export default class HeaderCommercant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      socket: io(URL_ORDERS),
    };
  }

  componentDidMount = async () => {
    let entreprise;
    let isOpen;
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      ...Ionicons.font,
    });
    const idCommercant = this.props.initialRouteParams.merchantId;
    await axios
      .get(`${URL_API}/api/merchant/profile/id/${idCommercant}`)
      .then((res) => {
        entreprise = res.data.enterprise;
        isOpen = res.data.isOpen;
      });
    this.setState({
      entreprise: entreprise,
      isOpen: isOpen,
      merchantId: idCommercant,
    });

    this.state.socket.on("closing", async () => {
      this.setState({ isOpen: false });
      await axios
        .patch(`${URL_API}/api/merchant/update/${this.state.merchantId}`, {
          isOpen: false,
        })
        .catch((err) =>
          console.error(`Error at updating isOpen (header) : ${err}`)
        );
    });
  };
  toggleSwitch = async () => {
    // const idCommercant = this.props.navigation.state.params.merchantId // avec action
    const idCommercant = this.props.initialRouteParams.merchantId;
    // this.setState({isOpen:!this.state.isOpen})
    await axios.patch(`${URL_API}/api/merchant/update/${idCommercant}`, {
      isOpen: !this.state.isOpen,
    });
  };

  handleToggleOpenMerchant = async () => {
    if (this.state.isOpen) {
      this.state.socket.emit("merchantIsClosed", {
        merchantId: this.state.merchantId,
      });
    } else {
      Actions.refs.Home.showOpenModal();
      this.state.socket.emit("merchantIsOpen", {
        merchantId: this.state.merchantId,
      });
    }
    this.setState({ isOpen: !this.state.isOpen });
    await axios
      .patch(`${URL_API}/api/merchant/update/${this.state.merchantId}`, {
        isOpen: !this.state.isOpen,
      })
      .catch((err) =>
        console.error(`Error at updating isOpen (header) : ${err}`)
      );
  };

  render() {
    return (
      <Header
        style={{ backgroundColor: "#3D0814" }}
        androidStatusBarColor="#3D0814"
      >
        <Left>
          <Button
            transparent
            title="Open drawer"
            onPress={() => Actions.drawerOpen()}
          >
            <Icon name="menu" style={{ color: "#fefee2" }} />
          </Button>
        </Left>
        <Body>
          <Text style={Styles.textHeaderStyleMerchant}>
            {this.state.entreprise ? this.state.entreprise : <Spinner />}
          </Text>
        </Body>
        <Right>
          <Text style={{ color: this.state.isOpen ? "orange" : "white" }}>
            {this.state.isOpen === true ? "Ouvert" : "Fermé"}
          </Text>
          <Switch
            onValueChange={() => this.handleToggleOpenMerchant()}
            value={this.state.isOpen}
            trackColor={{ true: "orange", false: "silver" }}
            thumbColor={this.state.isOpen ? "orange" : "gray"}
          />
        </Right>
      </Header>
    );
  }
}
