// ================== IMPORT REACT MODULES & ENVIRONMENT VARIABLES ====================
import React from "react";
import { View, Button, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Actions } from "react-native-router-flux";
import DropdownMenu from "../../forked_components/dropdownMenu/index";
import * as axios from "axios";
import { URL_API } from "../../env";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import LoaderView from "../LoaderView";

// ================== CLIENT LOCATION CLASS COMPONENT ====================
export default class ClientLocation extends React.Component {
  constructor() {
    super();
    this.state = {
      optionValue: [
        [500, 1000, 2000],
        [null, "food", "other"],
      ],
      optionText: [
        ["500m", "1km", "2km"],
        ["Tout", "Alimentaire", "Autre"],
      ],
      markers: [],
      category: null,
      distance: 500,
      loaded: false,
    };
  }

  componentDidMount = async () => {
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    location.coords.latitude = this.props.user.location.coordinates[0];
    location.coords.longitude = this.props.user.location.coordinates[1];
    await this.setState({
      location: location,
      loaded: true,
    });
    this.customChoice();
  };

  // Refresh mapview with new selected values
  updateDropdown = async (row, selection) => {
    if (row === 0) {
      await this.setState({ distance: this.state.optionValue[row][selection] });
      this.customChoice();
    } else if (row === 1) {
      await this.setState({ category: this.state.optionValue[row][selection] });
      this.customChoice();
    }
  };

  // Show shop markers using distance & type filters
  customChoice = async () => {
    await axios
      .get(
        `${URL_API}/api/user/merchants/${this.state.location.coords.latitude}/${this.state.location.coords.longitude}/2`
      )
      .then((response) => {
        let points = response.data;
        if (this.state.category != null) {
          // Handle the filter
          let isFoodShop = this.state.category == "food";
          points = points.filter((shop) => shop.foodShop == isFoodShop);
        }
        let current = [];
        for (let i = 0; i < points.length; i++) {
          let newDist = this.calculDistance(
            this.state.location.coords.latitude,
            this.state.location.coords.longitude,
            points[i].location.coordinates[0],
            points[i].location.coordinates[1]
          );
          // Save in meters, convert distance in meters
          if (newDist * 1000 < this.state.distance) {
            current.push(
              <Marker
                key={points[i]._id}
                style={{ backgroundColor: "blue" }}
                coordinate={{
                  latitude: points[i].location.coordinates[0],
                  longitude: points[i].location.coordinates[1],
                }}
                title={points[i].enterprise}
                description={points[i].category}
                image={
                  points[i].foodShop == true
                    ? {
                        uri: `https://cdn0.iconfinder.com/data/icons/shop-and-store-1/64/Bag_Shop-store-pouch-backpacks-shopping-knapsack-wallet-128.png`,
                      }
                    : {
                        uri: `https://cdn1.iconfinder.com/data/icons/search-engine-optimisation-seo/44/seo_icons-50-128.png`,
                      }
                }
              />
            );
          }
        }
        this.setState({ markers: current });
      })
      .catch(function (error) {
        console.error(error);
        this.setState({ loaded: false });
      });
  };

  // Algorithm to calculate latitudeDelta and LongitudeDelta for the Mapview
  regionFrom(lat, lon, distance) {
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
    return {
      latitude: lat,
      longitude: lon,
      latitudeDelta,
      longitudeDelta,
    };
  }

  // Algorithm to calculate distance between 2 coordinates
  calculDistance(lat1, lon1, lat2, lon2) {
    let p = 0.017453292519943295; // ==> Math.PI / 180
    let c = Math.cos;
    let a =
      0.5 -
      c((lat2 - lat1) * p) / 2 +
      (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;
    return 12742 * Math.asin(Math.sqrt(a)); // ==> 2 * R; R = 6371 km
  }

  render() {
    if (this.state.loaded !== false) {
      return (
        <View style={{ flex: 1 }}>
          <DropdownMenu
            style={{ flex: 1 }}
            bgColor={"#001932"}
            tintColor={"#fefee2"}
            activityTintColor={"orange"}
            handler={this.updateDropdown}
            data={this.state.optionText}
          >
            <MapView
              style={{
                flex: 1,
              }}
              initialRegion={this.regionFrom(
                this.state.location.coords.latitude,
                this.state.location.coords.longitude,
                10000
              )}
            >
              <Marker
                coordinate={this.state.location.coords}
                title={"Ma Position"}
                description={"Hello, je suis ici !!"}
              />
              {this.state.markers}
              <MapView.Circle // Scope management
                center={this.state.location.coords}
                radius={this.state.distance}
                strokeColor={"#001932"}
                fillColor={"rgba(230,238,255,0.5)"}
              />
            </MapView>
          </DropdownMenu>
        </View>
      );
    } else {
      return <LoaderView />;
    }
  }
}
