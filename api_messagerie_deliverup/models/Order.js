const mongoose = require("mongoose");

const schema = mongoose.Schema({
  state: { type: String, default: "standby" },
  user: {
    idUser: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    expoToken: String,
  },
  merchant: {
    idMerchant: String,
    enterprise: String,
    category: String,
    email: String,
    phone: String,
    expoToken: String,
  },
  deliverer: {
    idDeliverer: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    expoToken: String,
  },
  products: [
    { idProduct: String, name: String, price: String, quantity: Number },
  ],
  date: { type: Date, default: Date.now },
  timeSlot: { start: Date, end: Date },
});

module.exports = mongoose.model("Order", schema);
