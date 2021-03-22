import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const qrSize = width * 1;

const Styles = StyleSheet.create({
  // ================== SHARED STYLE BETWEEN COMPONENTS ====================
  // ========= IMAGE STYLE =========
  image: {
    flex: 1,
    resizeMode: "cover",
  },
  NoAccesCamera: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  qrStyle: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  shopListImage: {
    width: 65,
    height: 65,
  },
  cartImage: {
    width: "100%",
    height: "100%",
  },
  paymentImage: {
    height: 60,
    width: "26%",
  },
  paymentLockImage: {
    height: 30,
    width: "5%",
    marginLeft: "1%",
  },
  imageRegister: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  // ========= TITLE STYLE =========
  titleStyle: {
    color: "#fefee2",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "transparent",
    width: "100%",
    textTransform: "uppercase",
  },
  titleProfileStyle: {
    color: "#fefee2",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "transparent",
    width: "100%",
    paddingBottom: 5,
    textTransform: "uppercase",
  },
  titleProfileLike: {
    color: "#fefee2",
    fontSize: 18,
    textAlign: "center",
    backgroundColor: "transparent",
    width: "100%",
    paddingBottom: 5,
    textTransform: "uppercase",
  },
  titleContainer: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#fefee2",
  },
  titleInformationContainer: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#fefee2",
    textTransform: "uppercase",
    color: "black",
  },
  // ========= TEXT STYLE =========
  textStyle: {
    color: "#fefee2",
    textAlign: "center",
  },
  textStyleShopList: {
    color: "#fefee2",
  },
  textBold: {
    fontWeight: "bold",
    color: "#fefee2",
    textAlign: "center",
  },
  textBoldWhite: {
    fontWeight: "bold",
    color: "#fefee2",
    textAlign: "center",
    textTransform: "uppercase",
  },
  textItalic: {
    color: "#fefee2",
    fontStyle: "italic",
  },
  textQuestionBold: {
    color: "#fefee2",
    fontWeight: "bold",
    fontSize: 20,
  },
  textMerchantClose: {
    color: "red",
    fontStyle: "italic",
  },
  textBlackBold: {
    fontWeight: "bold",
    textAlign: "center",
  },
  textBoldAndUpperCase: {
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  validateProfil: {
    color: "#fefee2",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  easterTitle: {
    color: "#fefee2",
    fontWeight: "bold",
    textDecorationLine: "underline",
    textAlign: "center",
  },
  textStyleSelected: {
    color: "orange",
    textAlign: "center",
    fontWeight: "bold",
  },
  textButtonStyle: {
    color: "#fefee2",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    textTransform: "uppercase",
  },
  textChoiceStyle: {
    color: "orange",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  askQuestion: {
    color: "#fefee2",
    textAlign: "center",
    textDecorationLine: "underline",
  },
  PaymentText: {
    textAlign: "center",
    color: "#fefee2",
    fontSize: 20,
  },
  textXItems: {
    color: "orange",
    fontWeight: "bold",
  },
  textError: {
    textAlign: "center",
    color: "red",
    fontWeight: "bold",
  },
  modifyProfilStyle: {
    color: "black",
    backgroundColor: "#fefee2",
    marginHorizontal: "1.5%",
  },
  textValidated: {
    textAlign: "center",
    color: "lightgreen",
    fontWeight: "bold",
  },
  // ========= CARDS STYLE =========
  cardStyle: {
    width: "100%",
    alignSelf: "center",
  },
  dashBoardCard: {
    width: "90%",
  },
  profilCardStyle: {
    width: "90%",
    alignSelf: "center",
  },
  cardLobby: {
    marginTop: "40%",
    borderRadius: 20,
  },
  cardFindStyle: {
    borderColor: "orange",
    backgroundColor: "#001932",
    width: "100%",
  },
  cardStyleRegister: {
    backgroundColor: "#17212b",
    marginBottom: "5%",
    borderColor: "orange",
  },
  cardQr: {
    borderRadius: 20,
  },
  // ========= CARDITEMS STYLE =========
  cardItemHeaderStyle: {
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#fefee2",
  },
  cardItemStyle: {
    backgroundColor: "transparent",
  },
  cardItemLobby: {
    justifyContent: "center",
    backgroundColor: "orange",
    borderRadius: 20,
  },
  cardItemModify: {
    justifyContent: "center",
    backgroundColor: "#001932",
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: "orange",
  },
  validateStyle: {
    backgroundColor: "#001932",
    borderColor: "orange",
    borderWidth: 2,
    width: "50%",
    justifyContent: "center",
  },
  closeStyle: {
    backgroundColor: "#001932",
    borderColor: "orange",
    borderWidth: 2,
    width: "50%",
    justifyContent: "center",
  },
  cardItemChoiceStyle: {
    justifyContent: "center",
    backgroundColor: "transparent",
    width: "100%",
  },
  cardItem: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#001932",
    width: "100%",
    height: 75,
    borderColor: "orange",
    borderWidth: 0.5,
  },
  cardItemMerchantClosed: {
    backgroundColor: "#17212b",
    opacity: 0.45,
    width: "100%",
    borderColor: "orange",
    borderWidth: 1.5,
  },
  cardItemProfile: {
    backgroundColor: "#001932",
    width: "100%",
    height: 75,
    borderColor: "orange",
    borderWidth: 0.5,
  },
  cardItemCenterProfile: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#001932",
    width: "100%",
    height: 75,
    borderColor: "orange",
    borderWidth: 0.5,
  },
  cardItemFooterProfile: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#001932",
    width: "100%",
    borderColor: "orange",
    borderWidth: 0.5,
  },
  orderCardItemStyle: {
    justifyContent: "center",
    backgroundColor: "#001932",
    width: "100%",
  },
  // ========= MODAL STYLE =========
  modalView: {
    height: "100%",
    marginTop: "12%",
    borderWidth: 0.5,
    borderColor: "orange",
  },
  // ========= VIEWS STYLE =========
  homepageLeftView: {
    width: "40%",
    marginLeft: "-1%",
  },
  registerMainView: {
    height: "100%",
  },
  homepageRightView: {
    width: "40%",
    marginLeft: "20%",
  },
  ordersView: {
    backgroundColor: "#001932",
    borderWidth: 0.5,
    borderColor: "orange",
  },
  blurView: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  chatView: {
    marginRight: 10,
    marginBottom: 5,
  },
  inDeliveryModalView: {
    marginRight: "15%",
  },
  paymentView: {
    maxHeight: 60,
    width: "100%",
    flexDirection: "row",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
  paymentSmsView: {
    maxHeight: 60,
    width: "100%",
    flexDirection: "row",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  MainViewProfile: {
    width: "100%",
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
  },
  customViewFirstRowLike: {
    width: "30%",
  },
  customViewSecondRowLike: {
    width: "40%",
  },
  customViewThirdRowLike: {
    width: "30%",
    alignItems: "center",
  },
  faqView: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#001932",
    // borderTopWidth: 0.5,
    // borderTopColor: "#fefee2",
    borderWidth: 0.5,
    borderColor: "#fefee2",
  },
  // ========= LIST ITEM STYLE =========
  chatList: {
    backgroundColor: "#001932",
    flex: 0,
    minHeight: "10%",
    alignSelf: "center",
    justifyContent: "center",
    width: "100%",
    borderBottomColor: "orange",
    borderBottomWidth: 0.2,
  },
  // ========= BODY STYLE =========
  dashboardBodyStyle: {
    width: "100%",
  },
  // ========= TOUCHABLE STYLE =========
  touchableAlign: {
    alignItems: "center",
  },
  makeBorder: {
    borderBottomColor: "orange",
    borderLeftColor: "#17212b",
    borderRightColor: "#17212b",
    borderTopColor: "#17212b",
    borderWidth: 0.5,
  },
  qrButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#001932",
    width: "100%",
    height: "10%",
    borderColor: "orange",
    borderWidth: 0.5,
  },
  // ========= THUMBNAIL STYLE =========
  homepageThumbnail: {
    width: 100,
    height: 100,
  },
  colorThumbnail: {
    backgroundColor: "orange",
    alignSelf: "center",
  },
  colorThumbnailOff: {
    backgroundColor: "red",
  },
  colorCartThumbnail: {
    backgroundColor: "lightgreen",
  },
  colorCreamThumbnail: {
    backgroundColor: "#fefee2",
  },
  thumbnailWithRadius: {
    borderWidth: 0.5,
    borderColor: "orange",
  },
  colorCreamThumbnailWithMargin: {
    backgroundColor: "#fefee2",
    marginLeft: "-2%",
    marginRight: "2%",
  },
  thumbnailWithMargin: {
    marginLeft: "-2%",
    marginRight: "2%",
  },
  thumbnailWithBorder: {
    borderWidth: 1,
    borderColor: "#001932",
  },
  findMapImage: {
    borderWidth: 0.5,
    borderColor: "#001932",
    marginLeft: 15,
    height: 42,
    width: 42,
  },
  // ========= ICON STYLE =========
  arrowStyle: {
    color: "orange",
  },
  // ========= TAB BAR STYLE =========
  tabBar: {
    backgroundColor: "#001932",
  },
  indicator: {
    backgroundColor: "orange",
  },
  // ========= SCROLL VIEW STYLE =========
  ScrollMain: {
    alignSelf: "center",
    width: "100%",
  },
  // ========= ITEMS VIEW STYLE =========
  itemSlide: {
    marginHorizontal: 20,
    flexDirection: "column",
  },
  // ==================== HEADER TEMPLATE STYLE ====================
  textHeaderStyleOpen: {
    color: "#fefee2",
    fontSize: 28,
    alignSelf: "center",
    fontWeight: "bold",
  },
  textHeaderStyleUp: {
    color: "orange",
    fontSize: 28,
    alignSelf: "center",
    fontWeight: "bold",
  },
  backgroundHeader: {
    backgroundColor: "#001932",
    borderBottomWidth: 0.5,
    borderBottomColor: "orange",
  },
  // ==================== FOOTER TEMPLATE STYLE ====================
  footerStyle: {
    backgroundColor: "#001932",
    borderTopWidth: 0.5,
    borderTopColor: "orange",
  },
  footerHeight: {
    height: 75,
  },
  // ==================== PERSONNAL PICTURE STYLE ====================
  pictureContainer: {
    flex: 1,
    alignItems: "center",
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  overlayContainer: {
    opacity: 0.5,
    backgroundColor: "#000000",
    marginTop: 155,
  },
  backdropContainer: {
    flex: 1,
    flexDirection: "column",
    borderRadius: 100,
    borderColor: "orange",
    borderWidth: 1.5,
  },
  headlineContainer: {
    fontSize: 18,
    textAlign: "center",
    color: "white",
  },
  logoStyleContainer: {
    color: "white",
    fontSize: 20,
  },
  // ==================== LOADER VIEW STYLE ====================
  containerLoaderView: {
    justifyContent: "center",
    backgroundColor: "transparent",
    height: "90%",
  },
  viewLoader: {
    alignSelf: "center",
  },
  textLoader: {
    color: "#fefee2",
    fontSize: 20,
  },
  // ================== SELECT PRODUCTS SHOPLIST ====================
  productsMainView: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  productsView: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    height: "30%",
    width: "70%",
    backgroundColor: "lightgrey",
    borderColor: "orange",
    borderWidth: 1.5,
    borderRadius: 20,
  },
  selectMainProductView: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  selectProductView: {
    flexDirection: "row",
    display: "flex",
    alignSelf: "center",
    justifyContent: "center",
    width: "85.5%",
    height: "auto",
    textAlign: "center",
  },
  selectIcon: {
    color: "orange",
    fontSize: 50,
  },
  selectIconAdd: {
    color: "orange",
    fontSize: 50,
    textAlign: "center",
  },
  selectText: {
    fontSize: 30,
    textAlign: "center",
  },
  selectH1: {
    textAlign: "center",
  },
  selectRadius: {
    borderRadius: 20,
  },
  selectItalic: {
    fontStyle: "italic",
  },
  selectButton: {
    alignSelf: "center",
    borderRadius: 20,
    backgroundColor: "#001932",
    borderWidth: 1.5,
    borderColor: "orange",
  },
  // ================== FIND DELIVERY STYLE ====================
  buttonFind: {
    alignSelf: "flex-end",
    borderRadius: 20,
    backgroundColor: "orange",
    borderColor: "black",
    borderWidth: 1,
  },
  customFindButton: {
    flex: 1,
    backgroundColor: "orange",
    borderRadius: 20,
    alignSelf: "center",
  },
  textButtonFind: {
    flex: 1,
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  // ================== BUTTON STYLE ====================
  buttonRegister: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#001932",
    width: "100%",
    height: 60,
    borderColor: "orange",
    borderWidth: 0.5,
  },
  buttonSign: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#001932",
    width: "100%",
    height: 60,
    borderColor: "orange",
    borderWidth: 0.5,
  },
  // ================== QR SCANNER STYLE ====================
  qrScanView: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  qrAdaptiveSize: {
    width: qrSize,
    height: qrSize,
  },
  // ================== EASTER EGG STYLE ====================
  easterView: {
    flexDirection: "row",
    display: "flex",
    width: "100%",
    alignItems: "center",
  },
  easterMargin: {
    marginRight: 10,
    borderWidth: 1,
    borderColor: "orange",
  },
});

export default Styles;
