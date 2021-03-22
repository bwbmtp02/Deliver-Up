// ================== IMPORT REACT MODULES & ENVIRONMENT VARIABLES ====================
import React, { Component } from "react";
import { View, Image, Keyboard, TouchableOpacity, Alert } from "react-native";
import {
  Title,
  Button,
  Text,
  Input,
  Icon,
  Content,
  Card,
  CardItem,
  Left,
  Right,
  Thumbnail,
  Body,
} from "native-base";
import { Avatar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import * as Permissions from "expo-permissions";
import Autocomplete from "react-native-autocomplete-input";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { URL_API, URL_MEDIA } from "../../../env";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import Styles from "./../../../Style";
import LoaderView from "./../../LoaderView";

// ================== REGISTER CLASS COMPONENT ====================
export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mail: "",
      password: "",
      confirmPassword: "",
      enterPassword: true,
      phone: "",
      step: 1,
      error: [],
      autoCompleteAdressLabel: [],
      adressInput: "",
      firstName: "",
      lastName: "",
      phone: "",
      idPictureHasBeenSelected: false,
      profilPictureHasBeenSelected: false,
      loading: false,
    };
  }

  // ========= Methods ShowSetps & whichStep for ProgressBar Render ===========
  showSteps = () => {
    return (
      <Card transparent>
        <CardItem footer style={Styles.cardItemChoiceStyle}>
          <ProgressSteps
            completedStepIconColor={"orange"}
            completedCheckColor={"black"}
            topOffset={10}
            marginBottom={20}
            completedProgressBarColor={"orange"}
            activeStepIconBorderColor={"orange"}
            labelFontSize={11}
            activeLabelColor={"white"}
            activeStep={this.whichStep(this.state.step)}
            activeStepNumColor={"white"}
          >
            <ProgressStep label={`Vos identifiants`} removeBtnRow={true} />
            <ProgressStep
              label={`Vos informations personnelles`}
              removeBtnRow={true}
            />
            <ProgressStep label={`Votre adresse`} removeBtnRow={true} />
            <ProgressStep label={`Vos photos`} removeBtnRow={true} />
          </ProgressSteps>
        </CardItem>
      </Card>
    );
  };

  whichStep = (step) => {
    switch (step) {
      case 1:
        return 0;
      case 2:
        return 1;
      case 3:
        return 2;
      case 4:
        return 3;
    }
  };

  // ========= Methods for ask permissions ===========
  askForCameraPermission = async () => {
    const permissionResult = await Permissions.askAsync(Permissions.CAMERA);
    if (permissionResult.status !== "granted") {
      Alert.alert("Vous n'avez pas autorisé l'accès à l'appareil photo !", [
        { text: "ok" },
      ]);
      return false;
    }
    return true;
  };

  askForLibraryPermission = async () => {
    const permissionResult = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    if (permissionResult.status !== "granted") {
      Alert.alert("Vous n'avez pas autorisé l'accès à vos photos !", [
        { text: "ok" },
      ]);
      return false;
    }
    return true;
  };

  // ========= Methods for numeric pad render ===========
  onTextChanged(value) {
    // code to remove non-numeric characters from text in phone form
    this.setState({
      phone: value.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, ""),
    });
  }

  // ========= Methods ImagePickers Alerts for Profil Picture & Id Picture ===========
  createPickImageAlert = () =>
    Alert.alert(
      "Selectionner une photo de profile",
      "",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Prendre une photo",
          onPress: () => this.takeImage(),
        },
        {
          text: "Sélectionner une photo",
          onPress: () => this.pickImage(),
        },
      ],
      { cancelable: false }
    );

  createPickImageIdAlert = () =>
    Alert.alert(
      "Selectionner une photo de votre carte d'identité",
      "",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Prendre une photo",
          onPress: () => this.takeImageId(),
        },
        {
          text: "Sélectionner une photo",
          onPress: () => this.pickImageId(),
        },
      ],
      { cancelable: false }
    );

  // ========= Methods Profil ImagePickers ===========
  pickImage = async () => {
    const hasPermission = await this.askForLibraryPermission();
    if (!hasPermission) {
      return;
    } else {
      let image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 1,
        base64: true,
      });
      if (!image.cancelled) {
        this.setState({
          selectedProfilPicture: image,
          profilPictureHasBeenSelected: true,
        });
      }
    }
  };

  takeImage = async () => {
    const hasPermission = await this.askForCameraPermission();
    if (!hasPermission) {
      return;
    } else {
      let image = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 1,
        base64: true,
      });
      if (!image.cancelled) {
        this.setState({
          selectedProfilPicture: image,
          profilPictureHasBeenSelected: true,
        });
      }
    }
  };

  // ========= Methods ID ImagePickers ===========
  pickImageId = async () => {
    const hasPermission = await this.askForLibraryPermission();
    if (!hasPermission) {
      return;
    } else {
      let image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 1,
        base64: true,
      });
      if (!image.cancelled) {
        this.setState({
          selectedIdPicture: image,
          idPictureHasBeenSelected: true,
        });
      }
    }
  };

  takeImageId = async () => {
    const hasPermission = await this.askForCameraPermission();
    if (!hasPermission) {
      return;
    } else {
      let image = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 1,
        base64: true,
      });
      if (!image.cancelled) {
        this.setState({
          selectedIdPicture: image,
          idPictureHasBeenSelected: true,
        });
      }
    }
  };

  // ========= Methods Check Steps ===========
  checkStepOne = async () => {
    this.setState({ error: [] });
    Keyboard.dismiss();
    const error = [];
    const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    this.state.mail == ""
      ? error.push("Veuillez renseigner votre Email")
      : null;
    this.state.password == ""
      ? error.push("Veuillez renseigner un mot de passe")
      : null;
    this.state.password !== this.state.confirmPassword
      ? error.push("Les mots de passe ne correspondent pas")
      : null;

    if (
      this.state.mail !== "" &&
      this.state.password !== "" &&
      this.state.password === this.state.confirmPassword
    ) {
      if (re.test(this.state.mail) == true) {
        this.setState({ loading: true });
        await axios
          .get(`${URL_API}/api/user/profile/email/${this.state.mail}`)
          .then((res) =>
            !res.data.error
              ? (error.push("L'adresse mail est déjà utilisée"),
                this.setState({ loading: false }))
              : null
          )
          .catch((err) => {
            error.push("Une erreur est survenue, veuillez recommencer svp");
            this.setState({ error, loading: false });
          });
      } else {
        error.push("Veuillez renseigner une adresse mail valide");
      }
    }
    this.setState({ error });
    if (!error[0]) this.setState({ step: 2, loading: false });
  };

  checkStepTwo = () => {
    const error = [];
    if (this.state.firstName === "")
      error.push("Veuillez renseigner votre prénom");
    if (this.state.lastName === "")
      error.push("Veuillez renseigner votre nom de famille");
    if (this.state.phone === "")
      error.push("Veuillez renseigner votre numéro de téléphone");
    this.setState({ error });
    if (!error[0]) this.setState({ step: 3 });
  };

  checkStepThree = () => {
    const error = [];
    if (typeof this.state.address !== "object")
      error.push("Veuillez renseigner une adresse valide");
    this.setState({ error });
    if (!error[0]) this.setState({ step: 4 });
  };

  checkStepFour = () => {
    const error = [];
    if (
      this.state.profilPictureHasBeenSelected === false ||
      this.state.idPictureHasBeenSelected === false
    )
      error.push(
        "Séléctionnez vos photos avant de pouvoir finaliser votre inscription"
      );
    this.setState({ error });
    if (!error[0]) this.handleCreateUser();
  };

  // ========= Methods to handle adressChange ===========
  handleAdressChange = (value) => {
    this.setState({ adressInput: value });
    if (this.state.adressInput !== "") {
      axios
        .get(
          `https://api-adresse.data.gouv.fr/search/?q=${this.state.adressInput.replace(
            " ",
            "%20"
          )}&type=housenumber&autocomplete=1`
        )
        .then((res) => {
          const autoCompleteAdressLabel = [];
          if (res.data.features[0]) {
            res.data.features
              .slice(0, 3)
              .map((item) => autoCompleteAdressLabel.push(item));
            this.setState({ autoCompleteAdressLabel });
          }
        })
        .catch((err) => console.error(err));
    }
  };

  // ========= Methods to handle user creation ===========
  handleCreateUser = async () => {
    const error = [];
    try {
      this.setState({ loading: true });

      let saveProfilePicture = await fetch(`${URL_MEDIA}/newUserPicture`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imgsource: this.state.selectedProfilPicture.base64,
          userId: "newUser",
          date: new Date().getTime(),
        }),
      });

      let saveIdPicture = await fetch(`${URL_MEDIA}/userIdPicture`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imgsource: this.state.selectedIdPicture.base64,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          date: new Date().getTime(),
        }),
      });

      let dataPicture = await saveProfilePicture.json();
      let dataId = await saveIdPicture.json();
      this.setState({
        profilPicture: dataPicture.profilPicture,
        idCardPicture: dataId.idCardPicture,
        images: true,
      });

      const data = {
        deliverer: false,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        address: {
          number: this.state.address.properties.housenumber,
          street: this.state.address.properties.street,
          zipcode: this.state.address.properties.postcode,
          city: this.state.address.properties.city,
        },
        location: [
          this.state.address.geometry.coordinates[1],
          this.state.address.geometry.coordinates[0],
        ],
        phone: this.state.phone,
        email: this.state.mail,
        password: this.state.password,
        profilPicture: this.state.profilPicture,
        idCardPicture: this.state.idCardPicture,
      };

      await axios.post(`${URL_API}/api/user/new`, data);
      await axios
        .post(`${URL_API}/api/login/user`, {
          email: data.email,
          password: data.password,
        })
        .then((res) => {
          this.props.setConnection(res.data);
        });
    } catch (err) {
      error.push("Une erreur est survenue, veuillez recommencer svp");
      this.setState({ error, loading: false });
    }
  };

  // ========= Methods to handle errors ===========
  customErrorMsg = () => {
    if (this.state.error[0]) {
      return this.state.error.map((error, index) => (
        <View key={index}>
          <Separator />
          <Text style={Styles.textError}>{error}</Text>
        </View>
      ));
    }
  };

  // ========= Methods to show password ===========
  _changeIcon() {
    this.setState((prevState) => ({
      enterPassword: !prevState.enterPassword,
    }));
  }

  // ==================== STEP 01 ====================
  stepOne = () => {
    if (this.state.loading == false) {
      return (
        <Content>
          {this.showSteps()}
          <Card transparent>
            <CardItem style={Styles.cardItemModify}>
              <Thumbnail
                square
                small
                source={{
                  uri: `https://cdn4.iconfinder.com/data/icons/twitter-ui-set/128/Mail-512.png`,
                }}
              />
              <Input
                style={Styles.modifyProfilStyle}
                placeholder="Adresse mail"
                autoCapitalize="none"
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
                autoCorrect={false}
                onChangeText={(text) => this.setState({ mail: text })}
              />
            </CardItem>
            <Separator />
            <CardItem style={Styles.cardItemModify}>
              <Thumbnail
                square
                small
                source={{
                  uri: `https://cdn1.iconfinder.com/data/icons/internet-security-3/64/x-01-512.png`,
                }}
              />
              <Input
                style={Styles.modifyProfilStyle}
                placeholder="Mot de passe"
                autoCapitalize="none"
                secureTextEntry={this.state.enterPassword}
                onChangeText={(text) => this.setState({ password: text })}
              />
              <TouchableOpacity onPress={() => this._changeIcon()}>
                <Thumbnail
                  small
                  source={{
                    uri: `https://cdn0.iconfinder.com/data/icons/user-interface-198/64/show-password-interface-ui-512.png`,
                  }}
                  style={
                    this.state.enterPassword === false
                      ? Styles.colorThumbnailOff
                      : null
                  }
                />
              </TouchableOpacity>
            </CardItem>
            <Separator />
            <CardItem style={Styles.cardItemModify}>
              <Thumbnail
                square
                small
                source={{
                  uri: `https://cdn1.iconfinder.com/data/icons/internet-security-3/64/x-01-512.png`,
                }}
              />
              <Input
                style={Styles.modifyProfilStyle}
                placeholder="Confirmer mot de passe"
                autoCapitalize="none"
                secureTextEntry={this.state.enterPassword}
                onChangeText={(text) =>
                  this.setState({ confirmPassword: text })
                }
              />
              <TouchableOpacity onPress={() => this._changeIcon()}>
                <Thumbnail
                  small
                  source={{
                    uri: `https://cdn0.iconfinder.com/data/icons/user-interface-198/64/show-password-interface-ui-512.png`,
                  }}
                  style={
                    this.state.enterPassword === false
                      ? Styles.colorThumbnailOff
                      : null
                  }
                />
              </TouchableOpacity>
            </CardItem>
          </Card>
          {this.customErrorMsg()}
          <Separator value={"3%"} />
          <Button
            rounded
            block
            onPress={() => this.checkStepOne()}
            style={Styles.buttonRegister}
          >
            <Text style={Styles.textChoiceStyle}> Continuer </Text>
          </Button>
        </Content>
      );
    } else {
      return <LoaderView />;
    }
  };

  //==================== STEP 02 ====================
  stepTwo = () => {
    return (
      <Content>
        {this.showSteps()}
        <Card transparent>
          <CardItem style={Styles.cardItemModify}>
            <Thumbnail
              small
              style={Styles.thumbnailWithMargin}
              source={{
                uri: `https://cdn1.iconfinder.com/data/icons/flat-business-icons/128/user-512.png`,
              }}
            />
            <Input
              style={Styles.modifyProfilStyle}
              placeholder="Nom de Famille"
              autoCorrect={false}
              onChangeText={(text) => this.setState({ lastName: text })}
            />
          </CardItem>
          <Separator />
          <CardItem style={Styles.cardItemModify}>
            <Thumbnail
              small
              style={Styles.thumbnailWithMargin}
              source={{
                uri: `https://cdn1.iconfinder.com/data/icons/flat-business-icons/128/user-512.png`,
              }}
            />
            <Input
              style={Styles.modifyProfilStyle}
              placeholder="Prénom"
              autoCorrect={false}
              onChangeText={(text) => this.setState({ firstName: text })}
            />
          </CardItem>
          <Separator />
          <CardItem style={Styles.cardItemModify}>
            <Thumbnail
              small
              style={Styles.thumbnailWithMargin}
              source={{
                uri: `https://cdn1.iconfinder.com/data/icons/flat-business-icons/128/mobile-512.png`,
              }}
            />
            <Input
              style={Styles.modifyProfilStyle}
              placeholder="Téléphone"
              keyboardType="numeric"
              onChangeText={(value) => this.onTextChanged(value)}
              value={this.state.phone}
              onChangeText={(text) => this.setState({ phone: text })}
            />
          </CardItem>
        </Card>
        {this.customErrorMsg()}
        <Separator value={"3%"} />
        <Button
          rounded
          block
          onPress={() => this.checkStepTwo()}
          style={Styles.buttonRegister}
        >
          <Text style={Styles.textChoiceStyle}> Continuer </Text>
        </Button>
      </Content>
    );
  };

  //==================== STEP 03 ====================
  stepThree = () => {
    return (
      <View>
        {this.showSteps()}
        <Card transparent>
          <CardItem style={Styles.cardItemModify}>
            <Thumbnail
              style={Styles.thumbnailWithMargin}
              small
              source={{
                uri: `https://cdn4.iconfinder.com/data/icons/twitter-ui-set/128/Mail-512.png`,
              }}
            />
            <Autocomplete
              placeholder="Adresse"
              value={this.state.adressInput}
              onChangeText={(value) => this.handleAdressChange(value)}
              data={this.state.autoCompleteAdressLabel}
              keyExtractor={(item) => item.properties.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      adressInput: item.properties.label,
                      autoCompleteAdressLabel: [],
                      address: item,
                    });
                  }}
                >
                  <Text style={Styles.textBlackBold}>
                    {item.properties.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </CardItem>
        </Card>
        {this.customErrorMsg()}
        <Separator value={"3%"} />
        <Button
          rounded
          block
          onPress={() => this.checkStepThree()}
          style={Styles.buttonRegister}
        >
          <Text style={Styles.textChoiceStyle}> Continuer </Text>
        </Button>
      </View>
    );
  };

  //==================== STEP 04 ====================
  stepFour = () => {
    if (this.state.loading == false) {
      return (
        <Content>
          {this.showSteps()}
          <TouchableOpacity onPress={this.createPickImageAlert}>
            <Card style={Styles.cardStyleRegister}>
              <CardItem style={Styles.cardItemChoiceStyle}>
                <Left>
                  <Thumbnail
                    square
                    source={{
                      uri: `https://cdn1.iconfinder.com/data/icons/outline-color-common-8/32/photocamera-add-512.png`,
                    }}
                  />
                  <Text style={Styles.textStyle}>Photo de profil</Text>
                </Left>
                <Right>
                  <Icon name="arrow-forward" style={Styles.arrowStyle} />
                </Right>
              </CardItem>
            </Card>
          </TouchableOpacity>
          {this.state.selectedProfilPicture && (
            <Body>
              <Avatar
                rounded
                size="xlarge"
                source={{
                  uri: this.state.selectedProfilPicture.uri,
                }}
              />
              <Separator />
            </Body>
          )}
          <TouchableOpacity onPress={this.createPickImageIdAlert}>
            <Card style={Styles.cardStyleRegister}>
              <CardItem style={Styles.cardItemChoiceStyle}>
                <Left>
                  <Thumbnail
                    square
                    source={{
                      uri: `https://cdn0.iconfinder.com/data/icons/online-education-butterscotch-vol-2/512/Student_Profile-512.png`,
                    }}
                  />
                  <Text style={Styles.textStyle}>Photo d'identité</Text>
                </Left>
                <Right>
                  <Icon name="arrow-forward" style={Styles.arrowStyle} />
                </Right>
              </CardItem>
            </Card>
          </TouchableOpacity>
          {this.state.selectedIdPicture && (
            <Image
              source={{ uri: this.state.selectedIdPicture.uri }}
              style={Styles.imageRegister}
            />
          )}
          {this.customErrorMsg()}
          <Separator value={"3%"} />
          <View>
            <Button
              rounded
              block
              onPress={() => this.checkStepFour()}
              style={Styles.buttonRegister}
            >
              <Text style={Styles.textChoiceStyle}> Finaliser </Text>
            </Button>
          </View>
          <Separator />
        </Content>
      );
    } else {
      return (
        <View>
          <Separator value={"10%"} />
          <LoaderView />
        </View>
      );
    }
  };

  render() {
    return (
      <View style={Styles.registerMainView}>
        <Separator />
        <Title style={Styles.titleStyle}>Enregistrement</Title>
        <Separator />
        {this.state.step === 1 ? <this.stepOne /> : null}
        {this.state.step === 2 ? <this.stepTwo /> : null}
        {this.state.step === 3 ? <this.stepThree /> : null}
        {this.state.step === 4 ? <this.stepFour /> : null}
      </View>
    );
  }
}

// ================== STYLE COMPONENT ====================
const Separator = (props) => (
  <View style={{ marginVertical: props.value || 8 }} />
);
