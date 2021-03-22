import React from "react";
import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";

import { Container, Content } from "native-base";

export default class QRCodeGenerator extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Content>
          <View style={{ alignItems: "center" }}>
            {this.props ? (
              <QRCode
                value={JSON.stringify({
                  _id: this.props.selectedOrder._id,
                  idUser: this.props.selectedOrder.user.idUser,
                  idMerchant: this.props.selectedOrder.merchant.idMerchant,
                  idDeliverer: this.props.selectedOrder.deliverer.idDeliverer,
                  step: "fromMerchant",
                })}
                quietZone={8}
                size={200}
              />
            ) : null}
            {/* <Text>Salut mon pote</Text> */}
          </View>
        </Content>
      </Container>
    );
  }
}
