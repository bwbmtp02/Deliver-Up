const GeoJSON = require("mongoose-geojson-schema");
const mongoose = require("mongoose");

const schema = mongoose.Schema({
  foodShop: Boolean,
  isVerify: { type: Boolean, default: false },
  category: { type: String, required: true },
  enterprise: { type: String, required: true },
  name: { type: String, required: true },
  address: {
    number: String,
    street: String,
    zipcode: String,
    city: String,
  },
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: Array, default: [0, 0] },
  },
  // location: { types: mongoose.Schema.Types.Point, default: "en attente..." },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  pictures: String,
  IBAN: { type: String, required: true },
  siretNumber: { type: String, required: true },
  products: [
    {
      name: String,
      price: String,
      picture: String,
      available: Boolean,
    },
  ],
  isOpen: { type: Boolean, required: true, default: false },
  salesHistory: [
    {
      idOrder: String,
    },
  ],
  expoToken: { type: String, default: 0 },
});

module.exports = mongoose.model("Merchant", schema);
