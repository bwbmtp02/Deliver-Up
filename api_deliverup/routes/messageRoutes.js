const express = require("express");
const router = express.Router();
var cors = require("cors");
module.exports = router;
const ChatUser = require("../models/ChatUser");

// List by idOrder

router.get("/:id", async (req, res) => {
  try {
    const message = await ChatUser.find({ idOrder: req.params.id });
    if (!message) throw Error();
    res.send(message);
  } catch {
    res.status(404);
    res.send({ error: "message doesn't exist!" });
  }
});

// Create new conversation with idOrder

router.post("/new", async (req, res) => {
  const message = new ChatUser({
    idOrder: req.body.idOrder,
    messageDeliverer: req.body.messageDeliverer,
    messageCustomer: req.body.messageCustomer,
  });
  await message.save();
  res.send(message);
});

// update customer state with id message

router.patch("/customer/state/:msg", async (req, res) => {
  try {
    const message = await ChatUser.updateOne(
      { "messageCustomer._id": req.params.msg },
      { $set: { "messageCustomer.$.state": req.body.state } },
      { new: true }
    );
    if (!message) throw Error("Something went wrong while update message");
    res.status(200).json(message);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

// update deliverer state with id message

router.patch("/deliverer/state/:msg", async (req, res) => {
  try {
    const message = await ChatUser.updateOne(
      { "messageDeliverer._id": req.params.msg },
      { $set: { "messageDeliverer.$.state": req.body.state } },
      { new: true }
    );
    if (!message) throw Error("Something went wrong while update message");
    res.status(200).json(message);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

// add message deliverer by id conversation

router.patch("/deliverer/add/:id", async (req, res) => {
  try {
    const message = await ChatUser.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { messageDeliverer: req.body.messageDeliverer } },
      { new: true }
    );
    if (!message) throw Error("Something went wrong while delete message");
    res.status(200).json(message);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

// add message customer by id conversation

router.patch("/customer/add/:id", async (req, res) => {
  try {
    const message = await ChatUser.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { messageCustomer: req.body.messageCustomer } },
      { new: true }
    );
    if (!message) throw Error("Something went wrong while delete message");
    res.status(200).json(message);
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});
