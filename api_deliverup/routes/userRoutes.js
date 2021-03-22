const express = require("express");
const { findByIdAndUpdate } = require("../models/User");
const User = require("../models/User");
const router = express.Router();
var cors = require("cors");
const Gift = require("../models/Gift");
const bcrypt = require("bcryptjs");
const Merchant = require("../models/Merchant");
const Order = require("../models/Order");
const validate = require("../middlewares/validate");
const orderSecure = require("../middlewares/secureNotif");
const cookieParser = require("cookie-parser");

//------ middleware ---------//

router.use(cookieParser());
router.use(cors());

// list user by id

router.get("/profile/id/:id", validate.checkJWT, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) throw Error();
    const { _doc, ...rest } = user;
    const { password, ...userWithoutPassword } = _doc;
    res.send(userWithoutPassword);
  } catch {
    res.status(404);
    res.send({ error: "User doesn't exist!" });
  }
});

// user list by email (check if the email exists)

router.get("/profile/email/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) throw Error();
    // res.send(user);
    res.send({ success: "Email user exists!" });
  } catch {
    res.status(200);
    res.send({ error: "Email user doesn't exist!" });
  }
});

// create new user

router.post("/new", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  const user = new User({
    deliverer: req.body.deliverer,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    address: req.body.address,
    location: { type: "Point", coordinates: req.body.location },
    phone: req.body.phone,
    email: req.body.email,
    password: hashPassword,
    profilPicture: req.body.profilPicture,
    idCardPicture: req.body.idCardPicture,
    creditCard: req.body.creditCard,
    userPoint: req.body.userPoint,
    deliveryHours: req.body.deliveryHours,
    deliveryArea: [{ type: "Point", coordinates: req.body.deliveryArea }],
    purchaseHistory: req.body.purchaseHistory,
    deliveryHistory: req.body.deliveryHistory,
  });
  console.log(req.body.deleveryArea);
  await user.save();
  res.send({ success: "success user created" });
});

//----------UPDATE USER---------//

router.patch("/update/:id", validate.checkJWT, async (req, res) => {
  try {
    // update user apart password
    const user = await User.findByIdAndUpdate(req.params.id, req.body);
    if (!user) throw Error("Something went wrong while Update user");
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});
//---------UPDATE USER -> PASSWORD BY ID----------//

router.patch("/update/password/:id", validate.checkJWT, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    // if password is correct
    const validpwd = await bcrypt.compare(req.body.password, user.password);
    if (!validpwd)
      return res.status(200).send({ error: "Email or Password is wrong" });
    // Generate hashPassword
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.newPassword, salt);
    // Update new password
    console.log(`user password:${user.password}`);
    user.password = await hashPassword;
    // save the change value
    await user.save();
    if (!user) throw Error("Something went wrong while Update user");
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

// user who wish display the merchants in her area

router.get("/merchants/:lat/:lng/:r", validate.checkJWT, async (req, res) => {
  try {
    const merchants = await Merchant.find({
      location: {
        $geoWithin: {
          $centerSphere: [
            [req.params.lat, req.params.lng],
            req.params.r / 4750,
          ], // finds merchants within a "r"km zone
        },
      },
    });
    if (!merchants) throw Error();
    const merchantsWithoutPassword = [];
    merchants.map((merchant) => {
      const { _doc, ...rest } = merchant;
      const { password, ...merchantWithoutPassword } = _doc;
      merchantsWithoutPassword.push(merchantWithoutPassword);
    });
    res.send(merchantsWithoutPassword);
  } catch {
    res.status(404);
    res.send({ error: "merchant doesn't exist !" });
  }
});

/////-------------------handle gift--------------------------------------/////

// gifts list

router.get("/gifts", validate.checkJWT, async (req, res) => {
  try {
    const gift = await Gift.find();
    if (!gift) throw Error();
    res.send(gift);
  } catch {
    res.status(200);
    res.send({ error: "gift doesn't exist!" });
  }
});

// gift list with id

router.get("/gift/:id", validate.checkJWT, async (req, res) => {
  try {
    const gift = await Gift.findOne({ _id: req.params.id });
    if (!gift) throw Error();
    res.send(gift);
  } catch {
    res.status(200);
    res.send({ error: "gift doesn't exist!" });
  }
});

// user get his order in progress

router.get("/order/:id", validate.checkJWT, async (req, res) => {
  try {
    const order = await Order.find({
      "user.idUser": req.params.id,
      state: {
        $in: [
          "pendingMerchant",
          "pendingDeliverer",
          "awaitingDelivery",
          "inProgress",
        ],
      },
    });
    if (!order) throw Error();
    res.send(order);
  } catch {
    res.status(200);
    res.send({ error: "Order doesn't exist !" });
  }
});

// deliverer who wish display the orders in progress in his area

router.get("/orders/:lat/:lng/:r", validate.checkJWT, async (req, res) => {
  try {
    const orders = await Order.find({
      state: "pendingDeliverer",
      location: {
        $geoWithin: {
          $centerSphere: [
            [req.params.lat, req.params.lng],
            req.params.r / 4750,
          ], // finds merchants within a "r"km zone
        },
      },
    });
    if (!orders) throw Error();
    res.send(orders);
  } catch {
    res.status(404);
    res.send({ error: "order doesn't exist !" });
  }
});

// update order when state change ()
router.patch(
  "/order/state/:id/:user/:token",
  orderSecure.secure,
  async (req, res) => {
    try {
      const order = await Order.findByIdAndUpdate(req.params.id, req.body);
      if (!order) throw Error();
      res.send(order);
    } catch {
      res.status(200);
      res.send({ error: "Order doesn't exist!" });
    }
  }
);

// get all orders for orders server
router.get("/getOrder/:user/:token", orderSecure.secure, async (req, res) => {
  try {
    const order = await Order.find({
      "user.idUser": req.params.user,
    });
    if (!order) throw Error();
    res.send(order);
  } catch {
    res.status(200);
    res.send({ error: "Order doesn't exist !" });
  }
});

// Have all the orders of a user when he is a delivery person
router.get(
  "/getOrder/deliverer/:user/:token",
  orderSecure.secure,
  async (req, res) => {
    try {
      const order = await Order.find({
        "deliverer.idDeliverer": req.params.user,
      });
      if (!order) throw Error();
      res.send(order);
    } catch {
      res.status(200);
      res.send({ error: "Order doesn't exist !" });
    }
  }
);

// get order when user is deleverer

router.get("/order/deliverer/:id", validate.checkJWT, async (req, res) => {
  try {
    const order = await Order.findOne({
      "deliverer.idDeliverer": req.params.id,
      state: { $in: ["awaitingDelivery", "inProgress"] },
    });
    if (!order) throw Error();
    res.send(order);
  } catch {
    res.status(200);
    res.send({ error: "Order doesn't exist !" });
  }
});

module.exports = router;
