// ================== IMPORT REACT NATIVE MODULES ====================
import * as React from "react";
import { ImageBackground, TouchableOpacity, Image, View } from "react-native";
import { Text, Card, CardItem, Thumbnail } from "native-base";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import Styles from "./../../Style";

// ================== VARIABLES DECLARATION ====================
const wallpaper = require("../../assets/background.jpg");

// ================== QR READER CLASS COMPONENT ====================
export default class QrReader extends React.Component {
  state = {
    hasCameraPermission: null,
    scanned: false,
  };

  // When loading ask for permission to use the camera
  async componentDidMount() {
    this.getPermissionsAsync();
    this.props.socket.on("scanError", (err) => console.log(err));
  }

  // Manage permission to use the camera & status change
  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  };

  handleBarCodeScanned = ({ type, data }) => {
    this.setState({
      scanned: true,
      //dataScanned: data,
      dataScanned: JSON.parse(data),
    });
  };

  socketScanned = () => {
    const { dataScanned } = this.state;
    if (dataScanned.step === "fromMerchant") {
      this.props.socket.emit("delivererScanMerchant", {
        token: this.props.token,
        ...dataScanned,
      });
    } else if (dataScanned.step === "fromClient") {
      this.props.socket.emit("delivererScanClient", {
        token: this.props.token,
        ...dataScanned,
      });
    }
  };

  render() {
    const { hasCameraPermission, scanned } = this.state;
    if (hasCameraPermission === null) {
      return (
        <ImageBackground source={wallpaper} style={Styles.image}>
          <Separator />
          <Card style={Styles.cardQr}>
            <CardItem style={Styles.cardItemLobby}>
              <Thumbnail
                large
                source={{
                  uri: `https://cdn1.iconfinder.com/data/icons/devices-4/512/camera-512.png`,
                }}
              />
              <Text style={Styles.textBlackBold}>
                {" "}
                Demande d'autorisation de la caméra{" "}
              </Text>
            </CardItem>
          </Card>
        </ImageBackground>
      );
    }
    if (hasCameraPermission === false) {
      return (
        <ImageBackground source={wallpaper} style={Styles.NoAccesCamera}>
          <Card style={Styles.cardQr}>
            <CardItem style={Styles.cardItemLobby}>
              <Thumbnail
                large
                style={Styles.thumbnailWithBorder}
                source={{
                  uri: `https://cdn3.iconfinder.com/data/icons/essential-flat/100/Camera-512.png`,
                }}
              />
              <Text style={Styles.textBlackBold}>
                {" "}
                Aucun accès à la caméra{" "}
              </Text>
            </CardItem>
          </Card>
        </ImageBackground>
      );
    }
    if (scanned) {
      this.socketScanned();
    }
    return (
      <ImageBackground source={wallpaper} style={Styles.qrStyle}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={Styles.qrScanView}
        >
          <Image
            style={Styles.qrAdaptiveSize}
            source={require("./../../assets/qr.png")}
          />
        </BarCodeScanner>
        {scanned && (
          <TouchableOpacity
            style={Styles.qrButton}
            onPress={() => this.setState({ scanned: false })}
          >
            <Text style={Styles.textBoldWhite}>
              Appuyer pour scanner à nouveau
            </Text>
          </TouchableOpacity>
        )}
      </ImageBackground>
    );
  }
}

// ================== STYLE COMPONENT ====================
const Separator = () => <View style={{ marginVertical: 8 }} />;
