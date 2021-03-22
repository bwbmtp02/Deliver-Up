// ================== IMPORT REACT MODULES & ENVIRONMENT VARIABLES ====================
import React from "react";
import { View, Image } from "react-native";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import MapView, { Marker } from "react-native-maps";
import { Actions } from "react-native-router-flux";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import LoaderView from "../../components/LoaderView";

// ================== ORDERMAP CLASS COMPONENT ====================
export default class OrderMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMsg: "",
      location: null,
    };
  }

  componentDidMount = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      this.setState({ errorMsg: "Autorisation de géolocalisation refusée" });
      Actions.Homepage();
    }
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    this.setState({ location: location });
  };

  regionFrom = (lat, lon, distance) => {
    distance = distance / 2;
    const circumference = 40075;
    const oneDegreeOfLatitudeInMeters = 111.32 * 1000;
    const angularDistance = distance / circumference;
    const latitudeDelta = distance / oneDegreeOfLatitudeInMeters;
    const longitudeDelta = Math.abs(
      Math.atan2(
        Math.sin(angularDistance) * Math.cos(lat),
        Math.cos(angularDistance) - Math.sin(lat) * Math.sin(lat)
      )
    );
    const data = {
      latitude: lat,
      longitude: lon,
      latitudeDelta,
      longitudeDelta,
    };
    return data;
  };

  render() {
    if (this.state.location === null) {
      return <LoaderView />;
    }
    if (this.state.location != null) {
      return (
        <View style={{ flex: 1 }}>
          <MapView // Map moved in the dropdown, it prevented the display of the dropdown
            style={{
              flex: 1,
            }}
            provider={null}
            initialRegion={this.regionFrom(
              this.state.location.coords.latitude,
              this.state.location.coords.longitude,
              2000
            )}
          >
            <Marker
              coordinate={{
                latitude: this.state.location.coords.latitude,
                longitude: this.state.location.coords.longitude,
              }}
              title={"Livreur"}
              description={"je couvre un périmètre conséquent !"}
            >
              <Image
                source={{
                  uri:
                    "https://thumbs.gfycat.com/InexperiencedGlossyAsiaticgreaterfreshwaterclam.webp",
                }}
                style={{ height: 60, width: 60 }}
              />
            </Marker>
            <Marker
              coordinate={{
                latitude: this.props.navigation.state.params.test.location
                  .coordinates[0],
                longitude: this.props.navigation.state.params.test.location
                  .coordinates[1],
              }}
              title={"Livré"}
              description={"j'attends ma course !"}
            >
              <Image
                source={{
                  uri:
                    "https://cdn4.iconfinder.com/data/icons/map-and-location-22/512/Pin-User-Location-Map-256.png",
                }}
                style={{ height: 50, width: 50 }}
              />
            </Marker>
            <Marker
              coordinate={{
                latitude: this.props.navigation.state.params.test.merchant
                  .address.location[0],
                longitude: this.props.navigation.state.params.test.merchant
                  .address.location[1],
              }}
              title={"commerçant"}
              description={"j'attends ma tune !"}
            >
              <Image
                source={{
                  uri:
                    "https://cdn4.iconfinder.com/data/icons/map-and-location-22/512/Pin-Home-Location-Map-256.png",
                }}
                style={{ height: 50, width: 50 }}
              />
            </Marker>
          </MapView>
        </View>
      );
    }
  }
}
