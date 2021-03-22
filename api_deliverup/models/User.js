const GeoJSON = require("mongoose-geojson-schema");
const mongoose = require("mongoose");

const schema = mongoose.Schema({
  deliverer: { type: Boolean, required: true, default: false }, // 0 = livré; 1 = livreur
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
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
  // location: mongoose.Schema.Types.Point,
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilPicture: { type: String, required: true },
  idCardPicture: { type: String, required: true },
  creditCard: {
    nb: String,
    expDate: String,
    crypto: String,
    nameOnCard: String,
  },
  userPoint: { type: Number, default: 0 },
  deliveryHours: [{ start: String, end: String }],
  // deleveryArea: [mongoose.Schema.Types.MultiPoint],
  deliveryArea: [
    {
      type: { type: String, default: "Point" },
      coordinates: { type: Array, default: [0, 0] },
    },
  ],
  purchaseHistory: [
    {
      idOrder: String,
    },
  ],
  deliveryHistory: [
    {
      idOrder: String,
    },
  ],
  like: { type: Number, default: 0 },
  expoToken: { type: String, default: 0 },
});

module.exports = mongoose.model("User", schema);
