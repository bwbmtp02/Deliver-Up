// ================== IMPORT REACT NATIVE MODULES ====================
import React, { Component } from "react";
import { View } from "react-native";
import { Text, Title, Thumbnail } from "native-base";
import { Header, Tooltip } from "react-native-elements";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import Styles from "./Styles";

// ================== OPENHEADER CLASS COMPONENT ====================
export default class OpenHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Header
        statusBarProps={{
          barStyle: "light-content",
          backgroundColor: "#3D0814",
        }}
        centerComponent={<DeliverUp />}
        containerStyle={Styles.backgroundHeader}
      />
    );
  }
}

// ================== STYLE COMPONENT & STYLE VARIABLE ====================
const DeliverUp = () => (
  <Tooltip
    height={650}
    width={300}
    backgroundColor={"#001932"}
    popover={
      <View>
        <Title style={Styles.easterTitle}>Supervisé par :</Title>
        <Separator />
        <View style={Styles.easterView}>
          <Thumbnail
            medium
            style={Styles.easterMargin}
            source={{
              uri: `https://cdn4.iconfinder.com/data/icons/diversity-v2-0-volume-03/64/celebrity-steve-jobs-apple-computers-mac-512.png`,
            }}
          />
          <Text style={Styles.textStyle}>Husson Pierre</Text>
        </View>
        <Separator />
        <Title style={Styles.easterTitle}>Développé par :</Title>
        <Separator />
        <View style={Styles.easterView}>
          <Thumbnail
            medium
            style={Styles.easterMargin}
            source={{
              uri: `https://cdn4.iconfinder.com/data/icons/diversity-v2-0-volume-03/64/superhero-catwoman-african-black-costume-512.png`,
            }}
          />
          <Text style={Styles.textStyle}>Ragheb Randa</Text>
        </View>
        <Separator />
        <View style={Styles.easterView}>
          <Thumbnail
            medium
            style={Styles.easterMargin}
            source={{
              uri: `https://cdn4.iconfinder.com/data/icons/diversity-v2-0-volume-03/64/celebrity-musician-amy-winehouse-rockstar-singer-512.png`,
            }}
          />
          <Text style={Styles.textStyle}>Lopez Elisa</Text>
        </View>
        <Separator />
        <View style={Styles.easterView}>
          <Thumbnail
            medium
            style={Styles.easterMargin}
            source={{
              uri: `https://cdn4.iconfinder.com/data/icons/diversity-v2-0-volume-03/64/superhero-spiderman-comics-512.png`,
            }}
          />
          <Text style={Styles.textStyle}>Ung Jean-Claude</Text>
        </View>
        <Separator />
        <View style={Styles.easterView}>
          <Thumbnail
            medium
            style={Styles.easterMargin}
            source={{
              uri: `https://cdn4.iconfinder.com/data/icons/diversity-v2-0-volume-03/64/celebrity-matrix-neo-man-white-512.png`,
            }}
          />
          <Text style={Styles.textStyle}>Mataix Philippe</Text>
        </View>
        <Separator />
        <View style={Styles.easterView}>
          <Thumbnail
            medium
            style={Styles.easterMargin}
            source={{
              uri: `https://cdn4.iconfinder.com/data/icons/diversity-v2-0-volume-03/64/celebrity-captain-jack-sparrow-pirate-carribean-512.png`,
            }}
          />
          <Text style={Styles.textStyle}>Ahumada Boris</Text>
        </View>
        <Separator />
        <View style={Styles.easterView}>
          <Thumbnail
            medium
            style={Styles.easterMargin}
            source={{
              uri: `https://cdn4.iconfinder.com/data/icons/diversity-v2-0-volume-03/64/superhero-deadpool-comics-512.png`,
            }}
          />
          <Text style={Styles.textStyle}>Egea Julien</Text>
        </View>
        <Separator />
      </View>
    }
  >
    <Text style={Styles.textHeaderStyleOpen}>
      Deliver'
      <Text style={Styles.textHeaderStyleUp}>Up</Text>
      <Text style={Styles.textHeaderStylePro}> Pro</Text>
    </Text>
  </Tooltip>
);

// ================== STYLE COMPONENT ====================
const Separator = () => <View style={{ marginVertical: 4 }} />;
