// ================== IMPORT REACT MODULES & ENVIRONMENT VARIABLES ====================
import React from "react";
import { ImageBackground, View, StyleSheet, Text } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import { Icon } from "native-base";
import { GiftedChat, Send, Bubble } from "react-native-gifted-chat";
import { io } from "socket.io-client";
import * as axios from "axios";
import FrenchDate from "dayjs/locale/fr";
import { URL_API, URL_MEDIA, URL_CHAT } from "../../env";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import OpenHeader from "../templates/OpenHeader";
import Styles from "./../../Style";

// ================== VARIABLES DECLARATION ====================
const wallpaper = require("../../assets/background.jpg");

// ================== CHAT CLASS COMPONENT ====================
export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      idUser: this.props.userId,
      idOrder: this.props.order._id,
      idDeliverer: this.props.order.deliverer.idDeliverer,
      idCustomer: this.props.order.user.idUser,
      idOtherUser: "",
      userAvatar: "",
      otherUserName: "",
      socket: "",
    };
    this.onSend = this.onSend.bind(this);
  }

  componentDidMount = async () => {
    if (this.state.idUser === this.state.idDeliverer) {
      await this.setState({
        idOtherUser: this.state.idCustomer,
        userType: "deliverer",
        userOtherType: "customer",
        userAvatar: this.props.order.user.profilePicture,
        otherUserName: this.props.order.user.firstName,
      });
    } else {
      await this.setState({
        idOtherUser: this.state.idDeliverer,
        userType: "customer",
        userOtherType: "deliverer",
        userAvatar: this.props.order.deliverer.profilePicture,
        otherUserName: this.props.order.deliverer.firstName,
      });
    }
    // On renseigne au serveur chat l id de la commande et de l'utilisateur
    this.setState({
      socket: io(
        URL_CHAT +
          "?idOrder=" +
          this.state.idOrder +
          "&idUser=" +
          this.state.idUser
      ),
    });

    // Axios pour récupérer le tableau de discussion
    await axios
      .get(URL_API + "/api/message/" + this.state.idOrder)
      .then((response) => {
        let currentMessages = [];

        // Deliverer Message
        if (response.data[0].messageDeliverer.length !== 0) {
          for (let i = 0; i < response.data[0].messageDeliverer.length; i++) {
            let msg = response.data[0].messageDeliverer[i];
            msg.idUser = this.state.idDeliverer;
            currentMessages.push(msg);
            //set the message to readed
            if (this.state.userType == "customer" && msg.state == "unread") {
              this.setMessageRead("deliverer", msg._id);
            }
          }
        }

        // Customer Message
        if (response.data[0].messageCustomer.length !== 0) {
          for (let i = 0; i < response.data[0].messageCustomer.length; i++) {
            let msg = response.data[0].messageCustomer[i];
            msg.idUser = this.state.idCustomer;
            currentMessages.push(msg);
            // set the message to readed
            if (this.state.userType == "deliverer" && msg.state == "unread") {
              this.setMessageRead("customer", msg._id);
            }
          }
        }

        // order by date (desc)
        currentMessages.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });

        let formatedMessages = [];
        for (let i = 0; i < currentMessages.length; i++) {
          const msg = currentMessages[i];

          formatedMessages.push({
            _id: msg._id,
            text: msg.text,
            createdAt: msg.date,
            user: {
              _id: msg.idUser,
            },
            sent: true,
            received: msg.state == "read",
          });
        }
        this.setState({ messages: formatedMessages });
      })
      .catch(function (error) {
        console.log(error);
      });

    // receive a new message
    this.state.socket.on(
      this.state.idOrder + "-" + this.state.idUser,
      (msg) => {
        if (!this.state.prevMessages) {
          this.setState({ prevMessages: [] });
        }
        this.setState({
          prevMessages: [
            {
              _id: msg._id,
              text: msg.text,
              createdAt: msg.date,
              user: {
                _id: msg.idUser,
              },
            },
          ],
        });
        this.setState((previousState) => {
          return {
            messages: GiftedChat.append(
              previousState.messages,
              this.state.prevMessages
            ),
          };
        });
        this.setMessageRead(this.state.userOtherType, msg._id);
      }
    );

    // wait the other user readed his messages
    this.state.socket.on(
      this.state.idOrder + "-" + this.state.idUser + "-reading",
      async (msgId) => {
        const tempMsg = [];
        await this.state.messages.map((el) => tempMsg.push(el));
        for (let i = 0; i < tempMsg.length; i++) {
          if (tempMsg[i].received === undefined) {
            tempMsg[i] = { received: true, ...tempMsg[i] };
          }
        }
        this.setState({ messages: tempMsg });
      }
    );
  };

  componentWillUnmount = () => {
    this.state.socket.disconnect();
  };

  setMessageRead(userType, msgId) {
    axios.patch(URL_API + "/api/message/" + userType + "/state/" + msgId, {
      state: "read",
    });
    this.state.socket.emit(
      this.state.idOrder + "-" + this.state.idUser + "-reading",
      msgId
    );
  }

  sendPushNotificationNewMessage = async () => {
    if (this.state.idUser !== this.props.order.user.idUser) {
      this.sendNotificationToClientForNewMessage(this.props.order);
    } else {
      this.sendNotificationToDelivererForNewMessage(this.props.order);
    }
  };

  sendNotificationToClientForNewMessage = async (data) => {
    const message = {
      to: data.user.expoToken,
      sound: "default",
      title: `Nouveau message `,
      body: `${data.deliverer.firstName} vous a envoyé un nouveau message`,
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        host: "exp.host",
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  };

  sendNotificationToDelivererForNewMessage = async (data) => {
    const message = {
      to: data.deliverer.expoToken,
      sound: "default",
      title: `Nouveau message `,
      body: `${data.user.firstName} vous a envoyé un nouveau message`,
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        host: "exp.host",
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  };

  // Method to send a new message
  async onSend(messages = []) {
    this.state.socket.emit(
      this.state.idOrder + "-" + this.state.idUser + "-sending",
      {
        _id: messages[0]._id,
        text: messages[0].text,
      }
    );
    messages[0].sent = true;
    await this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
    this.sendPushNotificationNewMessage();
  }

  // Render Custom Send Button
  renderSendButton(props) {
    return (
      <Send {...props}>
        <View style={Styles.chatView}>
          <Icon name="rightcircle" type="AntDesign" style={Styles.arrowStyle} />
        </View>
      </Send>
    );
  }

  // Render Users Chat Bubble Message
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "orange",
          },
        }}
        textStyle={{
          right: {
            color: "black",
            fontSize: 17,
          },
          left: {
            fontSize: 17,
          },
        }}
      />
    );
  }

  render() {
    return (
      <ImageBackground source={wallpaper} style={Styles.image}>
        <OpenHeader />
        <ListItem containerStyle={Styles.chatList}>
          <Avatar
            rounded
            avatarStyle={Styles.thumbnailWithRadius}
            size="large"
            source={{
              uri: `${URL_MEDIA}/picture/user/${this.state.userAvatar}`,
            }}
          />
          <Text style={Styles.textBoldWhite}>{this.state.otherUserName}</Text>
        </ListItem>
        <Separator />
        <GiftedChat
          timeFormat={FrenchDate.formats.LT}
          locale={FrenchDate.name}
          dateFormat={FrenchDate.formats.LL}
          renderSend={this.renderSendButton}
          showUserAvatar={true}
          showAvatarForEveryMessage={true}
          messages={this.state.messages}
          onSend={this.onSend}
          placeholder={"Ecrivez votre message"}
          user={{
            _id: this.props.idClient,
          }}
          renderBubble={this.renderBubble}
        />
      </ImageBackground>
    );
  }
}

// ================== STYLE COMPONENT ====================
const Separator = () => <View style={{ marginVertical: 5 }} />;
