const mongoose = require("mongoose");

const schema = mongoose.Schema({
  idOrder: { type: String, required: true },
  messageDeliverer: [
    {
      // use a custom id sended by GiftedChat
      _id: { type: String },
      state: { type: String, default: "unread" },
      //idDeliverer: String,
      date: { type: Date, default: Date.now },
      text: String,
    },
  ],
  messageCustomer: [
    {
      // use a custom id sended by GiftedChat
      _id: { type: String },
      state: { type: String, default: "unread" },
      //idCustomer: String,
      date: { type: Date, default: Date.now },
      text: String,
    },
  ],
  createdAt: { type: Date, default: Date.now, expires: 604800 },
});

module.exports = mongoose.model("ChatUser", schema);
