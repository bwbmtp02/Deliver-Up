const express = require("express");
//const { findByIdAndUpdate } = require("../models/Admin");
const Admin = require("../models/Admin");
const Merchant = require("../models/Merchant");
const User = require("../models/User");
const Order = require("../models/Order");
const ChatUser = require("../models/ChatUser");
const router = express.Router();
const bcrypt = require("bcryptjs");
var cors = require("cors");
const moment = require("moment");
const Gift = require("../models/Gift");
router.use(cors());

/////_____________HANDLE ADMIN_____________/////
//-----------ADMIN READ ALL----------//

router.get("/admins", async (req, res) => {
  try {
    const itemsPerPage = parseInt(req.query.limit);
    const pagesToSkip = parseInt(req.query.skip);
    const sort = JSON.parse(req.query.sort);
    const total = await Admin.countDocuments();
    const admin = await Admin.find()
      .sort(sort)
      .skip(pagesToSkip)
      .limit(itemsPerPage);
    if (!admin) throw Error();
    res.setHeader("Access-Control-Expose-Headers", "x-total-count");
    res.setHeader("x-total-count", total);
    res.send(admin);
  } catch {
    res.status(404);
    res.send({ error: "admin doesn't exist!" });
  }
});

//---------- ADMIN READ ONE BY ID----------//

router.get("/admins/:id", async (req, res) => {
  try {
    const admin = await Admin.findOne({ _id: req.params.id });
    if (!admin) throw Error();
    res.send(admin);
  } catch {
    res.status(404);
    res.send({ error: "admin doesn't exist!" });
  }
});

//----------CREATE ADMIN----------//

router.post("/admins", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const admin = new Admin({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    // address: req.body.address,
    phone: req.body.phone,
    email: req.body.email,
    password: hashPassword,
  });
  console.log(req.body);
  await admin.save();
  res.send(admin);
});

//----------UPDATE ADMIN BY ID----------//

router.patch("/admins/:id", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const admin = await Admin.findByIdAndUpdate(req.params.id, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      // address: req.body.address,
      phone: req.body.phone,
      email: req.body.email,
      password: hashPassword,
    });
    if (!admin) throw Error("Something went wrong while update admin");
    res.status(200).json(admin);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

//----------DELETE ADMIN----------//

router.delete("/admins/:id", async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) throw Error("Something went wrong while Update admin");
    res.status(200).json(admin);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

/////__________HANDLE MERCHANT__________/////
//----------READ ALL MERCHANTS----------//

// router.get("/merchants", async (req, res) => {
//   try {
//     const total = await Merchant.countDocuments();
//     const merchant = await Merchant.find();
//     if (!merchant) throw Error();
//     res.header("Access-Control-Expose-Headers", "x-total-count");
//     res.set("x-total-count", total);
//     res.header("Access-Control-Expose-Headers", "content-range");
//     res.set("content-range", total);
//     res.send(merchant);
//   } catch {
//     res.status(404);
//     res.send({ error: "Merchant doesn't exist!" });
//   }
// });

//----------READ ALL MERCHANTS WITH PAGINATION----------//

router.get("/merchants", async (req, res) => {
  try {
    const itemsPerPage = parseInt(req.query.limit);
    const pagesToSkip = parseInt(req.query.skip);
    const sort = JSON.parse(req.query.sort);
    const query = JSON.parse(req.query.query);
    const search = query.enterprise;
    const total = await Merchant.countDocuments();
    if (!search) {
      const merchant = await Merchant.find()
        .sort(sort)
        .skip(pagesToSkip)
        .limit(itemsPerPage);
      // console.log(search);
      if (!merchant) throw Error();
      res.setHeader("Access-Control-Expose-Headers", "x-total-count");
      res.setHeader("x-total-count", total);
      res.send(merchant);
    } else {
      const merchant = await Merchant.find({
        enterprise: { $regex: "^" + search, $options: "i" },
      })
        .sort(sort)
        .skip(pagesToSkip)
        .limit(itemsPerPage);
      console.log(search);
      if (!merchant) throw Error();
      res.setHeader("Access-Control-Expose-Headers", "x-total-count");
      res.setHeader("x-total-count", total);
      res.send(merchant);
    }
  } catch {
    res.status(404);
    res.send({ error: "Merchant doesn't exist!" });
  }
});

//----------READ ALL MERCHANT----------//

router.get("/allShop", async (req, res) => {
  try {
    const merchant = await Merchant.find();
    if (!merchant) throw Error();
    res.send(merchant);
  } catch {
    res.status(404);
    res.send({ error: "Merchant doesn't exist!" });
  }
});

//----------READ ONE MERCHANT----------//

router.get("/merchants/:id", async (req, res) => {
  try {
    const merchant = await Merchant.findOne({ _id: req.params.id });
    if (!merchant) throw Error();
    res.send(merchant);
  } catch {
    res.status(404);
    res.send({ error: "Merchant doesn't exist!" });
  }
});

//----------CREATE ONE MERCHANT---------- //

router.post("/merchants", async (req, res) => {
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
    // isOpen: req.body.isOpen,
    salesHistory: req.body.salesHistory,
  });
  console.log(req.body);
  await merchant.save();
  res.send(merchant);
});

//----------UPDATE MERCHANT----------//

router.patch("/merchants/:id", async (req, res) => {
  try {
    const merchant = await Merchant.findByIdAndUpdate(req.params.id, req.body);
    if (!merchant) throw Error("Something went wrong while Update merchant");
    res.status(200).json(merchant);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

//----------DELETE MERCHANT----------//

router.delete("/merchants/:id", async (req, res) => {
  try {
    const merchant = await Merchant.findByIdAndDelete(req.params.id);
    if (!merchant) throw Error("Something went wrong while Update merchant");
    res.status(200).json(merchant);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

/////__________HANDLE USER__________/////
//----------READ ALL USER----------//

router.get("/users", async (req, res) => {
  try {
    const itemsPerPage = parseInt(req.query.limit);
    const pagesToSkip = parseInt(req.query.skip);
    const sort = JSON.parse(req.query.sort);
    const query = JSON.parse(req.query.query);
    const search = query.lastName;
    const total = await User.countDocuments();
    if (!search) {
      const user = await User.find()
        .sort(sort)
        .skip(pagesToSkip)
        .limit(itemsPerPage);
      // console.log(search);
      if (!user) throw Error();
      res.setHeader("Access-Control-Expose-Headers", "x-total-count");
      res.setHeader("x-total-count", total);
      res.send(user);
    } else {
      const user = await User.find({
        lastName: { $regex: "^" + search, $options: "i" },
      })
        .sort(sort)
        .skip(pagesToSkip)
        .limit(itemsPerPage);
      console.log(search);
      if (!user) throw Error();
      res.setHeader("Access-Control-Expose-Headers", "x-total-count");
      res.setHeader("x-total-count", total);
      res.send(user);
    }
  } catch {
    res.status(404);
    res.send({ error: "User doesn't exist!" });
  }
});

//---------- COUNT ALL USERS (for charts) ----------//

router.get("/allUsers", async (req, res) => {
  try {
    const user = await User.countDocuments();
    if (!user) throw Error();
    res.send(JSON.stringify(user));
  } catch {
    res.status(404);
    res.send({ error: "Merchant doesn't exist!" });
  }
});

//----------READ ONE USER BY ID----------//

router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) throw Error();
    res.send(user);
  } catch {
    res.status(404);
    res.send({ error: "Merchant doesn't exist!" });
  }
});

//----------CREATE USER----------//

router.post("/users", async (req, res) => {
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
    deliveryArea: [
      {
        type: "Point",
        coordinates: req.body.deliveryArea,
      },
    ],
    purchaseHistory: req.body.purchaseHistory,
    deliveryHistory: req.body.deliveryHistory,
  });
  console.log(req.body);
  await user.save();
  res.send(user);
});

//----------UPDATE USER ----------//

router.patch("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body);
    if (!user) throw Error("Something went wrong while update user");
    res.status(200).json(user);
    console.log(req.body);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

//----------DELETE USER----------//

router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw Error("Something went wrong while Update user");
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

/////__________HANDLE ORDER__________/////
//----------READ ALL ORDER----------//

router.get("/orders", async (req, res) => {
  try {
    const itemsPerPage = parseInt(req.query.limit);
    const pagesToSkip = parseInt(req.query.skip);
    const sort = JSON.parse(req.query.sort);
    const query = JSON.parse(req.query.query);
    const search = query.lastName;
    const total = await Order.countDocuments();
    if (!search) {
      const order = await Order.find()
        .sort(sort)
        .skip(pagesToSkip)
        .limit(itemsPerPage);
      // console.log(search);
      if (!order) throw Error();
      res.setHeader("Access-Control-Expose-Headers", "x-total-count");
      res.setHeader("x-total-count", total);
      res.send(order);
    } else {
      const order = await Order.find({
        "user.lastName": { $regex: "^" + search, $options: "i" },
      })
        .sort(sort)
        .skip(pagesToSkip)
        .limit(itemsPerPage);
      console.log(search);
      if (!order) throw Error();
      res.setHeader("Access-Control-Expose-Headers", "x-total-count");
      res.setHeader("x-total-count", total);
      res.send(order);
    }
  } catch {
    res.status(404);
    res.send({ error: "Order doesn't exist!" });
  }
});

//----------READ ORDER BY ID----------//

router.get("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id });
    if (!order) throw Error();
    res.send(order);
  } catch {
    res.status(404);
    res.send({ error: "Order doesn't exist!" });
  }
});

//---------COUNT ORDERS IN PROGRESS BY DATE (for charts) ----------//

router.get("/todayOrdersinProgress/:day", async (req, res) => {
  try {
    const query = {
      date: {
        $gte: new Date(`${req.params.day}T00:00:00`),
        $lte: new Date(`${req.params.day}T23:59:59`),
      },
      state: {
        $in: [
          "pendingMerchant",
          "pendingDeliverer",
          "awaitingDelivery",
          "inProgress",
        ],
      },
    };
    const order = await Order.countDocuments(query, (err, count) => {
      if (err) {
        console.log(err);
      }
    });
    res.send(JSON.stringify(order));
  } catch {
    res.status(200);
    res.send({ error: "Order doesn't exist!" });
  }
});

//---------COUNT ORDER BY DATE (for charts) ----------//

router.get("/ordersChart/:day", async (req, res) => {
  try {
    const query = {
      date: {
        $gte: new Date(`${req.params.day}T00:00:00`),
        $lte: new Date(`${req.params.day}T23:59:59`),
      },
    };
    const order = await Order.countDocuments(query, (err, count) => {
      if (err) {
        console.log(err);
      }
    });
    res.send(JSON.stringify(order));
  } catch {
    res.status(200);
    res.send({ error: "Order doesn't exist!" });
  }
});

/////_________HANDLE GIFT_________/////
//-----------READ ALL GIFTS---------//

router.get("/gifts", async (req, res) => {
  try {
    const itemsPerPage = parseInt(req.query.limit);
    const pagesToSkip = parseInt(req.query.skip);
    const sort = JSON.parse(req.query.sort);
    const query = JSON.parse(req.query.query);
    const search = query.gifts;
    const total = await Gift.countDocuments();
    if (!search) {
      const gift = await Gift.find()
        .sort(sort)
        .skip(pagesToSkip)
        .limit(itemsPerPage);
      // console.log(search);
      if (!gift) throw Error();
      res.setHeader("Access-Control-Expose-Headers", "x-total-count");
      res.setHeader("x-total-count", total);
      res.send(gift);
    } else {
      const gift = await gift
        .find({
          "gifts[0].name": { $regex: "^" + search, $options: "i" },
        })
        .sort(sort)
        .skip(pagesToSkip)
        .limit(itemsPerPage);
      console.log(search);
      if (!gift) throw Error();
      res.setHeader("Access-Control-Expose-Headers", "x-total-count");
      res.setHeader("x-total-count", total);
      res.send(gift);
    }
  } catch {
    res.status(404);
    res.send({ error: "gift doesn't exist!" });
  }
});

//----------READ ONE GIFT BY ID----------//

router.get("/gifts/:id", async (req, res) => {
  try {
    const gift = await Gift.findOne({ _id: req.params.id });
    if (!gift) throw Error();
    res.send(gift);
  } catch {
    res.status(404);
    res.send({ error: "gift doesn't exist!" });
  }
});

//-----------CREATE GIFTS----------//

router.post("/gifts", async (req, res) => {
  const gift = new Gift({
    idMerchant: req.body.idMerchant,
    gifts: req.body.gifts,
  });
  console.log(req.body);
  await gift.save();
  res.send(gift);
});

//-----------UPDATE GIFTS----------//

router.patch("/gifts/:id", async (req, res) => {
  try {
    const gift = await Gift.findByIdAndUpdate(req.params.id, req.body);
    if (!gift) throw Error("Something went wrong while Update gift");
    res.status(200).json(gift);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

//----------DELETE GIFT----------//

router.delete("/gifts/:id", async (req, res) => {
  try {
    const gift = await Gift.findByIdAndDelete(req.params.id);
    if (!gift) throw Error("Something went wrong while Update gift");
    res.status(200).json(gift);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

/////__________HANDLE MESSAGE_________/////
//----------READ ALL MESSAGE----------//

router.get("/messages", async (req, res) => {
  try {
    const itemsPerPage = parseInt(req.query.limit);
    const pagesToSkip = parseInt(req.query.skip);
    const sort = JSON.parse(req.query.sort);
    const total = await ChatUser.countDocuments();
    const message = await ChatUser.find()
      .sort(sort)
      .skip(pagesToSkip)
      .limit(itemsPerPage);
    if (!message) throw Error();
    res.setHeader("Access-Control-Expose-Headers", "x-total-count");
    res.setHeader("X-Total-Count", total);
    res.send(message);
  } catch {
    res.status(404);
    res.send({ error: "message doesn't exist!" });
  }
});

//----------READ MESSAGE BY IDORDER----------//

router.get("/messages/:id", async (req, res) => {
  try {
    const total = await ChatUser.countDocuments();
    const message = await ChatUser.findOne({ _id: req.params.id });
    if (!message) throw Error();
    res.header("Access-Control-Expose-Headers", "X-Total-Count");
    res.set("X-Total-Count", total);
    res.send(message);
  } catch {
    res.status(404);
    res.send({ error: "message doesn't exist!" });
  }
});
module.exports = router;
