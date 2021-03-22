const express = require("express");
const { findByIdAndUpdate } = require("../models/Merchant");
const Merchant = require("../models/Merchant");
const Order = require("../models/Order");
const router = express.Router();
const cookieParser = require("cookie-parser");
var cors = require("cors");
const bcrypt = require("bcryptjs");
const validate = require("../middlewares/validate");
const orderSecure = require("../middlewares/secureNotif");

//-----MIDDLEWARE------//

router.use(cookieParser());
router.use(cors());

// merchant list by id

router.get("/profile/id/:id", validate.checkJWT, async (req, res) => {
  try {
    const merchant = await Merchant.findOne({ _id: req.params.id });
    if (!merchant) throw Error();
    const { _doc, ...rest } = merchant;
    const { password, ...merchantWithoutPassword } = _doc;
    res.send(merchantWithoutPassword);
  } catch {
    res.status(404);
    res.send({ error: "Merchant doesn't exist!" });
  }
});

// merchant list by email (check if the email exists)

router.get("/profile/email/:email", async (req, res) => {
  try {
    const merchant = await Merchant.findOne({ email: req.params.email });
    if (!merchant) throw Error();
    res.send({ success: "Email merchant exists" });
  } catch {
    res.status(200);
    res.send({ error: "Email merchant doesn't exist!" });
  }
});

// merchant list by siretNumber (check if the siretNumber exists)

router.get("/profile/siret/:siret", validate.checkJWT, async (req, res) => {
  try {
    const merchant = await Merchant.findOne({
      siretNumber: req.params.siret,
    });
    if (!merchant) throw Error();
    res.send({ success: "Merchant found with this siret" });
  } catch {
    res.status(200);
    res.send({ error: "Siret merchant doesn't exist!" });
  }
});

// get merchant order in progress

router.get("/order/:id", validate.checkJWT, async (req, res) => {
  try {
    const order = await Order.find({
      "merchant.idMerchant": req.params.id,
      state: {
        $in: ["pendingMerchant", "pendingDeliverer", "awaitingDelivery"],
      },
    });
    if (!order) throw Error();
    res.send(order);
  } catch {
    res.status(200);
    res.send({ error: "Order doesn't exist !" });
  }
});

// get merchant finished order

router.get(
  "/getOrder/merchant/:user/:token",
  orderSecure.secure,
  async (req, res) => {
    try {
      const order = await Order.find({
        "merchant.idMerchant": req.params.user,
      });
      if (!order) throw Error();
      res.send(order);
    } catch {
      res.status(200);
      res.send({ error: "Order doesn't exist !" });
    }
  }
);

// CREATE NEW MERCHANT

router.post("/new", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  const merchant = new Merchant({
    foodShop: req.body.foodShop,
    category: req.body.category,
    enterprise: req.body.enterprise,
    name: req.body.name,
    address: req.body.address,
    location: { type: "Point", coordinates: req.body.location },
    email: req.body.email,
    phone: req.body.phone,
    password: hashPassword,
    pictures: req.body.pictures,
    IBAN: req.body.IBAN,
    siretNumber: req.body.siretNumber,
    products: req.body.products,
    expoToken: req.body.expoToken,
    salesHistory: req.body.salesHistory,
  });
  console.log(`New merchant created: ${req.body}`);
  await merchant.save();
  res.send({ success: "success merchant created" });
});

//---------UPDATE MERCHANT BY ID----------//
router.patch("/update/:id", validate.checkJWT, async (req, res) => {
  try {
    const merchant = await Merchant.findByIdAndUpdate(req.params.id, req.body);
    if (!merchant) throw Error("Something went wrong while Update merchant");
    res.status(200).json(merchant);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

//---------UPDATE MERCHANT -> PASSWORD BY ID----------//

router.patch("/update/password/:id", validate.checkJWT, async (req, res) => {
  try {
    const merchant = await Merchant.findOne({ _id: req.params.id });
    // if password is correct
    const validpwd = await bcrypt.compare(req.body.password, merchant.password);
    if (!validpwd)
      return res.status(200).send({ error: "Email or Password is wrong" });
    // Generate hashPassword
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.newPassword, salt);
    // Update new password
    console.log(`merchant password:${merchant.password}`);
    merchant.password = await hashPassword;
    // save the change value
    await merchant.save();
    if (!merchant) throw Error("Something went wrong while Update merchant");
    res.status(200).json(merchant);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

//---------UPDATE MERCHANT -> SIRET BY ID----------//

router.patch("/update/siret/:id", validate.checkJWT, async (req, res) => {
  try {
    const merchant = await Merchant.findOne({ _id: req.params.id });
    // if password is correct
    const validpwd = await bcrypt.compare(req.body.password, merchant.password);
    if (!validpwd) return res.status(200).send({ error: "Password is wrong" });
    merchant.siretNumber = req.body.siretNumber;
    await merchant.save();
    if (!merchant) throw Error("Something went wrong while Update merchant");
    res.status(200).json(merchant);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

//---------UPDATE MERCHANT -> IBAN BY ID----------//

router.patch("/update/iban/:id", validate.checkJWT, async (req, res) => {
  try {
    const merchant = await Merchant.findOne({ _id: req.params.id });
    // if password is correct
    const validpwd = await bcrypt.compare(req.body.password, merchant.password);
    if (!validpwd) return res.status(200).send({ error: "Password is wrong" });
    merchant.IBAN = req.body.IBAN;
    await merchant.save();
    if (!merchant) throw Error("Something went wrong while Update merchant");
    res.status(200).json(merchant);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

// DELETE PRODUCTS MERCHANT

router.patch("/delete/:id/:product", validate.checkJWT, async (req, res) => {
  try {
    const merchant = await Merchant.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { products: { _id: req.params.product } } },
      { new: true }
    );
    if (!merchant) throw Error("Something went wrong while delete merchant");
    res.status(200).json(merchant);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

// ADD PRODUCTS WITH ID MERCHANT

router.patch("/add/:id", validate.checkJWT, async (req, res) => {
  try {
    const merchant = await Merchant.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { products: req.body.products } },
      { new: true }
    );
    if (!merchant) throw Error("Something went wrong while delete merchant");
    res.status(200).json(merchant);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

/* ========== MERCHANT SOCKET ROUTES ========== */

router.get(
  "/socket/order/:id/:user/:token",
  orderSecure.secure,
  async (req, res) => {
    try {
      const order = await Order.find({
        "merchant.idMerchant": req.params.id,
        state: {
          $in: ["pendingMerchant", "pendingDeliverer", "awaitingDelivery"],
        },
      });
      if (!order) throw Error();
      res.send(order);
    } catch {
      res.status(200);
      res.send({ error: "Order doesn't exist !" });
    }
  }
);

module.exports = router;
