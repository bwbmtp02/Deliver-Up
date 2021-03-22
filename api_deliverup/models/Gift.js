const mongoose = require("mongoose");

const schema = mongoose.Schema({
  //   idUser: { type: String },
  idMerchant: { type: String },
  gifts: [
    {
      name: String,
      quantity: Number,
      picture: String,
      description: String,
      pointNeeded: Number,
    },
  ],
  //   date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Gift", schema);
