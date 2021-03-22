const mongoose = require("mongoose");
const { setMaxListeners } = require("./Admin");
const moment = require("moment");

const schema = mongoose.Schema({
  state: { type: String, default: "pendingMerchant" },
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: Array, default: [0, 0] },
  },
  user: {
    idUser: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    expoToken: String,
    profilePicture: String,
    address: {
      number: String,
      street: String,
      zipcode: String,
      city: String,
      location: Array,
    },
  },
  merchant: {
    idMerchant: String,
    enterprise: String,
    category: String,
    email: String,
    phone: String,
    expoToken: String,
    profilePicture: String,
    address: {
      number: String,
      street: String,
      zipcode: String,
      city: String,
      location: Array,
    },
  },
  deliverer: {
    idDeliverer: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    expoToken: String,
    profilePicture: String,
  },
  products: [
    {
      idProduct: String,
      name: String,
      price: String,
      quantity: Number,
      productPicture: String,
    },
  ],
  date: { type: Date, default: Date.now },
  timeSlot: { start: Date, end: Date },
});

module.exports = mongoose.model("Order", schema);
