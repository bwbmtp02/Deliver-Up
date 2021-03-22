const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Merchant = require("../models/Merchant");
const User = require("../models/User");
const router = express.Router();
var cors = require("cors");
router.use(cors());

/////___________HANDLE ADMIN LOGIN_________/////

router.post("/login", async (req, res) => {
  try {
    const admin = await Admin.findOne({ username: req.body.username });
    // check if the username exist
    if (!admin) return res.status(400).send("this username doesn't exist");
    // if password is correct
    const validpwd = await bcrypt.compare(req.body.password, admin.password);
    if (!validpwd) return res.status(400).send("Username or Password is wrong");
    // Create and assign token
    const token = jwt.sign({ _id: admin.id }, process.env.TOKEN_SECRET);
    res.send({ token: token, username: admin.username });
    // res.send("login");
  } catch {
    res.status(404);
    res.send({ error: "admin doesn't exist!" });
  }
});

/////___________HANDLE USER LOGIN_________/////

router.post("/login/user", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    // check if the username exist
    if (!user)
      return res.status(200).send({ error: "this email doesn't exist" });
    // if password is correct
    const validpwd = await bcrypt.compare(req.body.password, user.password);
    if (!validpwd) return res.status(200).send("Email or Password is wrong");
    // Create and assign token
    const token = jwt.sign({ _id: user.id }, process.env.TOKEN_SECRET);
    // res.header("Authorization", "Bearer" + token);
    res.cookie("token", token, {
      maxAge: 31 * 24 * 30 * 60 * 1000, // 31 days
      httpOnly: true,
      //secure:true
    });
    // console.log(user)
    res.cookie('id', user.id);
    res.send({ token: token, userId: user.id });
  } catch {
    res.status(404);
    res.send({ error: "user doesn't exist!" });
  }
});

/////___________HANDLE MERCHANT LOGIN_________/////

router.post("/login/merchant", async (req, res) => {
  try {
    const merchant = await Merchant.findOne({ email: req.body.email });
    // check if the merchant mail exist
    if (!merchant)
      return res.status(200).send({ error: "this email doesn't exist" });
    // if password is correct
    const validpwd = await bcrypt.compare(req.body.password, merchant.password);
    if (!validpwd) return res.status(200).send("Email or Password is wrong");
    // Create and assign token
    const token = jwt.sign({ _id: merchant.id }, process.env.TOKEN_SECRET);
    res.header("Authorization", "Bearer" + token);
    res.cookie("token", token, {
      maxAge: 31 * 24 * 60 * 60 * 1000, // 31 days
      httpOnly: true,
      //secure:true
    });
    res.cookie('id', merchant.id);
    res.send({ token: token, merchantId: merchant.id });
    // res.send("login");
  } catch {
    res.status(404);
    res.send({ error: "merchant doesn't exist!" });
  }
});

module.exports = router;
