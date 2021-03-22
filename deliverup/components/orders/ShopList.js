// ================== IMPORT REACT MODULES & ENVIRONMENT VARIABLES ====================
import React from "react";
import {
  ImageBackground,
  View,
  Image,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Container,
  Content,
  Card,
  CardItem,
  Text,
  Icon,
  Left,
  Right,
  Button,
  Item,
  Body,
  Thumbnail,
  H1,
} from "native-base";
import * as axios from "axios";
import { Actions } from "react-native-router-flux";
import { ScrollView } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import { URL_API, URL_MEDIA } from "../../env";

// ================== IMPORT CUSTOM REACT NATIVE COMPONENTS ====================
import LoaderView from "../LoaderView";
import Styles from "./../../Style";

// ================== VARIABLES DECLARATION ====================
const wallpaper = require("../../assets/background.jpg");

// ================== SHOPLIST CLASS COMPONENT ====================
export default class ShopList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listfilters: [
        {
          name: "Tout voir",
          link: require(`../../assets/imagesSlide/list-removebg-preview.png`),
        },
        {
          name: "Epicerie",
          link: require(`../../assets/imagesSlide/shop.png`),
        },
        {
          name: "Boulangerie",
          link: require(`../../assets/imagesSlide/boulangerie1.png`),
        },
        {
          name: "Boucherie",
          link: require(`../../assets/imagesSlide/boucherie-removebg-preview.png`),
        },

        {
          name: "Fleuriste",
          link: require(`../../assets/imagesSlide/fleuriste.png`),
        },
        {
          name: "Fromagerie",
          link: require(`../../assets/imagesSlide/fromagerie1.png`),
        },
        {
          name: "Pharmacie",
          link: require(`../../assets/imagesSlide/pharmacie-removebg-preview.png`),
        },
      ],
      totalMerchantList: [],
      merchantList: [],
      loading: true,
      modalProductList: false,
      modalProductQuantityVisible: false,
      selectedProduct: null,
      selectedMerchant: null,
      productCount: 1,
      disabledMinus: true,
      opacityMinus: 0.5,
    };
  }
  componentDidMount = async () => {
    const location = this.props.user.location.coordinates;
    await axios
      .get(`${URL_API}/api/user/merchants/${location[0]}/${location[1]}/2`)
      .then((res) => {
        let closedMerchantList = [];
        let openedMerchantList = [];
        if (res.data[0]) {
          closedMerchantList = res.data.filter(
            (merchant) => merchant.isOpen === false
          );
          openedMerchantList = res.data.filter(
            (merchant) => merchant.isOpen === true
          );
        }
        this.setState({
          totalMerchantList: openedMerchantList.concat(closedMerchantList),
          merchantList: openedMerchantList.concat(closedMerchantList),
          loading: false,
        });
      });
  };

  filterList = (filter) => {
    const newMerchantList = [];
    if (filter.name === "Tout voir") {
      this.setState({ merchantList: this.state.totalMerchantList });
    } else {
      this.state.totalMerchantList.map((merchant) => {
        if (filter.name === merchant.category) {
          newMerchantList.push(merchant);
        }
      });
      this.setState({ merchantList: newMerchantList });
    }
  };

  handleProductCount = (action) => {
    if (action === "minus") {
      if (this.state.productCount === 1) {
        return;
      } else {
        if (this.state.productCount === 2) {
          this.setState({
            disabledMinus: true,
            opacityMinus: 0.5,
          });
        }
        this.setState({
          productCount: this.state.productCount - 1,
        });
      }
    } else if (action === "plus") {
      this.setState({
        productCount: this.state.productCount + 1,
        disabledMinus: false,
        opacityMinus: 1,
      });
    }
  };

  renderSelectedProduct = (selectedProduct, selectedMerchant) => {
    if (this.props.getOrder !== null) {
      if (selectedMerchant._id !== this.props.getOrder.merchant._id) {
        Alert.alert(
          "Impossible d'ajouter cet article",
          `Vous avez un panier pour un autre commerce (${this.props.getOrder.merchant.enterprise}), voulez vous vider votre panier et passer chez un autre commerçant ?`,
          [
            {
              text: "Annuler",
              style: "cancel",
            },
            {
              text: "Vider le panier",
              onPress: () => this.props.clearCart(),
            },
          ],
          { cancelable: true }
        );
      } else {
        this.props.getOrder.cart.some((product) => {
          if (product._id === selectedProduct._id) {
            if (product.quantity !== 1) {
              this.setState({
                disabledMinus: false,
                opacityMinus: 1,
              });
            }
            this.setState({ productCount: product.quantity });
            return true;
          } else {
            this.setState({ productCount: 1 });
            return false;
          }
        });
        this.setState({
          modalProductQuantityVisible: true,
          selectedProduct: selectedProduct,
        });
      }
    } else {
      this.setState({
        modalProductQuantityVisible: true,
        selectedProduct: selectedProduct,
      });
    }
  };

  handleOrder = () => {
    if (this.props.getOrder === null) {
      // order object
      const order = {
        merchant: this.state.selectedMerchant,
        cart: [
          { quantity: this.state.productCount, ...this.state.selectedProduct },
        ],
      };
      this.setState({
        productCount: 1,
        selectedProduct: null,
      });
      this.props.setOrder(order);
    } else if (
      this.props.getOrder.merchant._id === this.state.selectedMerchant._id
    ) {
      // push product in order array
      let newQuantity;
      const oldOrder = { ...this.props.getOrder };
      if (
        oldOrder.cart.some((product) => {
          if (product._id === this.state.selectedProduct._id) {
            newQuantity = this.state.productCount;
            product.quantity = newQuantity;
            return true;
          } else {
            return false;
          }
        })
      ) {
        // occurency
        this.props.setOrder(oldOrder);
      } else {
        // no occurency
        oldOrder.cart.push({
          quantity: this.state.productCount,
          ...this.state.selectedProduct,
        });
        this.props.setOrder(oldOrder);
      }
    }
  };

  render() {
    if (!this.state.loading) {
      return (
        <Container>
          <ImageBackground source={wallpaper} style={Styles.image}>
            <Content>
              <Separator />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={Styles.ScrollMain}
              >
                {this.state.listfilters.map((filter, index) => (
                  <Item
                    key={index}
                    style={Styles.itemSlide}
                    onPress={() => this.filterList(filter)}
                  >
                    <Image source={filter.link} style={Styles.shopListImage} />
                    <Text style={Styles.textStyleShopList}>{filter.name}</Text>
                    <Separator value={5} />
                  </Item>
                ))}
              </ScrollView>
              <Separator />
              <Separator />
              <Card transparent style={Styles.profilCardStyle}>
                <CardItem
                  button
                  bordered
                  style={Styles.cardItem}
                  onPress={() => Actions.ClientLocation()}
                >
                  <Left>
                    <Thumbnail
                      square
                      source={{
                        uri: `https://cdn1.iconfinder.com/data/icons/back-to-school-illustrathin/128/globe-earth-map-512.png`,
                      }}
                    />
                    <Text style={Styles.textStyleShopList}>
                      Afficher les boutiques sur la carte
                    </Text>
                  </Left>
                  <Right>
                    <Icon name="arrow-forward" style={Styles.arrowStyle} />
                  </Right>
                </CardItem>
              </Card>
              <Separator />
              <Separator />
              {!this.state.merchantList[0] ? (
                <Text style={Styles.textStyleShopList}>
                  Aucun magasin trouvé :(
                </Text>
              ) : (
                <Card transparent style={Styles.profilCardStyle}>
                  {this.state.merchantList.map((merchant, index) => (
                    <View key={index}>
                      <BlurView intensity={125} tint="dark">
                        <CardItem
                          button={merchant.isOpen ? true : false}
                          style={
                            merchant.isOpen
                              ? Styles.cardItem
                              : Styles.cardItemMerchantClosed
                          }
                          onPress={() =>
                            this.setState({
                              modalProductList: true,
                              selectedMerchant: merchant,
                            })
                          }
                        >
                          <Left>
                            <Thumbnail
                              source={{
                                uri: `${URL_MEDIA}/picture/merchant/${merchant.pictures}`,
                              }}
                            />
                          </Left>
                          <Body>
                            <Text style={Styles.textStyleShopList}>
                              {merchant.enterprise}
                            </Text>
                            <Text style={Styles.textItalic}>
                              ({merchant.category})
                            </Text>
                          </Body>
                          <Right>
                            {!merchant.isOpen ? (
                              <Text style={Styles.textMerchantClose}>
                                &ensp;Fermé
                              </Text>
                            ) : null}
                            <Icon
                              name="arrow-forward"
                              style={Styles.arrowStyle}
                            />
                          </Right>
                        </CardItem>
                      </BlurView>
                    </View>
                  ))}
                </Card>
              )}
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalProductList}
                onRequestClose={() =>
                  this.setState({ modalProductList: false })
                }
              >
                <View style={Styles.modalView}>
                  <ImageBackground source={wallpaper} style={Styles.image}>
                    {this.state.selectedMerchant ? (
                      <Content>
                        <Separator value={5} />
                        <Text style={Styles.titleContainer}>
                          {this.state.selectedMerchant.enterprise}
                        </Text>
                        <Separator value={10} />
                        <Card transparent>
                          <CardItem header style={Styles.cardItemHeaderStyle}>
                            <Text style={Styles.textBoldAndUpperCase}>
                              Produits
                            </Text>
                          </CardItem>
                          {this.state.selectedMerchant.products.map(
                            (product, index) => (
                              <BlurView intensity={125} tint="dark" key={index}>
                                <CardItem
                                  button={product.available ? true : false}
                                  onPress={() => {
                                    this.renderSelectedProduct(
                                      product,
                                      this.state.selectedMerchant
                                    );
                                  }}
                                  style={
                                    product.available
                                      ? Styles.cardItem
                                      : Styles.cardItemMerchantClosed
                                  }
                                >
                                  <Thumbnail
                                    source={{
                                      uri: `${URL_MEDIA}/merchant/${this.state.selectedMerchant._id}/${product.picture}`,
                                    }}
                                  />
                                  <Text style={Styles.textStyleShopList}>
                                    &ensp;{product.name}
                                  </Text>
                                  {product.available === false ? (
                                    <Text style={Styles.textMerchantClose}>
                                      &ensp;Indisponible
                                    </Text>
                                  ) : null}
                                  <Right>
                                    <Text style={Styles.textItalic}>
                                      &ensp;Prix : {product.price} €
                                    </Text>
                                  </Right>
                                </CardItem>
                              </BlurView>
                            )
                          )}
                        </Card>
                      </Content>
                    ) : null}
                  </ImageBackground>
                </View>
              </Modal>
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalProductQuantityVisible}
                onRequestClose={() =>
                  this.setState({ modalProductQuantityVisible: false })
                }
              >
                <View style={Styles.productsMainView}>
                  <View style={Styles.productsView}>
                    {this.state.selectedProduct ? (
                      <View style={Styles.selectMainProductView}>
                        <H1 style={Styles.selectH1}>
                          {this.state.selectedProduct.name}
                        </H1>
                        <View style={Styles.selectProductView}>
                          <TouchableOpacity
                            onPress={() => this.handleProductCount("minus")}
                            disabled={this.state.disabledMinus}
                          >
                            <View
                              style={{
                                borderRadius: 20,
                                opacity: this.state.opacityMinus,
                              }}
                            >
                              <Icon
                                name="remove-circle"
                                type="MaterialIcons"
                                style={Styles.selectIcon}
                              />
                            </View>
                          </TouchableOpacity>
                          <Text style={Styles.selectText}>
                            &ensp;{this.state.productCount}&ensp;
                          </Text>
                          <TouchableOpacity
                            onPress={() => this.handleProductCount("plus")}
                          >
                            <View style={Styles.selectRadius}>
                              <Icon
                                name="add-circle"
                                type="MaterialIcons"
                                style={Styles.selectIconAdd}
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                        <Text style={Styles.selectItalic}>
                          Total :{" "}
                          {Math.round(
                            parseFloat(this.state.selectedProduct.price) *
                              this.state.productCount *
                              100
                          ) / 100}{" "}
                          €
                        </Text>
                        <Button
                          active
                          style={Styles.selectButton}
                          onPress={() => this.handleOrder()}
                        >
                          <Text style={Styles.textStyle}>
                            Ajouter au panier
                          </Text>
                        </Button>
                        <Button
                          active
                          style={Styles.selectButton}
                          onPress={() =>
                            this.setState({
                              modalProductQuantityVisible: false,
                            })
                          }
                        >
                          <Text style={Styles.textStyle}>Fermer</Text>
                        </Button>
                      </View>
                    ) : null}
                  </View>
                </View>
              </Modal>
            </Content>
          </ImageBackground>
        </Container>
      );
    } else {
      return <LoaderView />;
    }
  }
}

// ================== STYLE COMPONENT ====================
const Separator = (props) => (
  <View style={{ marginVertical: props.value || 8 }} />
);
