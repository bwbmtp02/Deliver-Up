// ========== SERVER INITIALIZATION ==========

const mongoose = require("mongoose");
const express = require("express");
const app = express();
require("dotenv").config();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const url = process.env.URL;
const PORT = process.env.PORT;
const ChatUser = require("./models/ChatUser");
const Order = require("./models/Order");

// ========== CONNECT MONGOOSE TO MONGODB SERVICES ==========

mongoose.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// ========== SOCKET CHAT SERVICES ==========

io.on("connection", async (socket) => {
  // Save Order ID & User Id
  const idOrder = socket.handshake.query.idOrder;
  const idUser = socket.handshake.query.idUser;
  // Get discution array with the order ID
  let chat = await ChatUser.findOne({ idOrder: idOrder });

  // If no discution found, create one
  if (chat === null) {
    chat = new ChatUser({
      idOrder: idOrder,
    });
    await chat.save();
  }

  // Get the order Object with the order Id
  const order = await Order.findById(idOrder);

  // Detect if user is a customer or a deliverer
  const whoAmI =
    order.user.idUser === idUser ? "messageCustomer" : "messageDeliverer";

  // Get the other user Id who the user is talking to
  const idOtherUser =
    order.user.idUser === idUser
      ? order.deliverer.idDeliverer
      : order.user.idUser;

  socket.on(idOrder + "-" + idUser + "-reading", (msgId) => {
    //renderTicks  received the event to send to the user
    console.log("on reading", msgId);
    io.emit(idOrder + "-" + idOtherUser + "-reading", msgId);
  });

  socket.on(idOrder + "-" + idUser + "-sending", async (data) => {
    chat[whoAmI].push({ _id: data._id, text: data.text });
    await chat.save();

    const last = chat[whoAmI][chat[whoAmI].length - 1];
    io.emit(idOrder + "-" + idOtherUser, {
      _id: last._id,
      text: data.text,
      idUser: idUser,
      date: last.date,
    });
  });
});

// ========== SERVER.LISTEN  ==========

server.listen(PORT, () => {
  console.log(`Chat server has started at : http://localhost:${PORT}`);
});
