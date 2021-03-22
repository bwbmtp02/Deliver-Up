const mongoose = require("mongoose");
const express = require("express");
const app = express();
var cors = require("cors");
require("dotenv").config();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const url = process.env.URL;
const ChatUser = require("./models/ChatUser");
const Order = require("./models/Order");

mongoose.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

io.on("connection", async (socket) => {
  const idOrder = socket.handshake.query.idOrder;
  const idUser = socket.handshake.query.idUser;
  console.log("salut", idOrder, idUser);
  const chat = await ChatUser.findOne({ idOrder: idOrder });
  const order = await Order.findById(idOrder);

  const whoAmI =
    order.idUser == idUser ? "messageCustomer" : "messageDeliverer";
  const idOtherUser = order.idUser == idUser ? order.idDeliverer : order.idUser;

  console.log(idUser + " s'est connecte");

  socket.on("disconnect", () => {
    console.log(idUser + " disconnected");
  });

  socket.on(idOrder + "-" + idUser + "-typing", (value) => {
    //isTyping  received the event to send to the user
    console.log("on typing", value);
    io.emit(idOrder + "-" + idUser + "-typing", value);
  });

  socket.on(idOrder + "-" + idUser + "-reading", (msgId) => {
    //renderTicks  received the event to send to the user
    console.log("on reading", msgId);
    io.emit(idOrder + "-" + idUser + "-reading", msgId);
  });

  socket.on(idOrder + "-" + idUser + "-sending", async (data) => {
    console.log("Receive", data);
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

server.listen(3000, () => {
  console.log("Ecoute sur le port 3000");
});
