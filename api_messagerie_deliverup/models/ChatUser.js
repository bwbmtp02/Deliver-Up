const mongoose = require("mongoose");

const schema = mongoose.Schema({
  idOrder: { type: String, required: true },
  messageDeliverer: [
    {
      _id: { type: String },
      state: { type: String, default: "unread" },
      date: { type: Date, default: Date.now },
      text: String,
    },
  ],
  messageCustomer: [
    {
      _id: { type: String },
      state: { type: String, default: "unread" },
      date: { type: Date, default: Date.now },
      text: String,
    },
  ],
  createdAt: { type: Date, default: Date.now, expires: 604800 },
});

module.exports = mongoose.model("ChatUser", schema);
