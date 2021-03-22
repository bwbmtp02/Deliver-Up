const mongoose = require("mongoose");

const schema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  // address: {number:String, street:String, zipcode:String, city:String, lat:String, lng:String},
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("Admin", schema);
