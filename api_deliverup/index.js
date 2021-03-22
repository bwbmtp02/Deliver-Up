const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");
const cron = require("node-cron");
require("dotenv").config();
const merchantRoutes = require("./routes/merchantRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const messageRoutes = require("./routes/messageRoutes");
const authRoutes = require("./routes/authRoutes");
const Order = require("./models/Order");
const PORT = process.env.PORT;
const url = process.env.URL;

// Use connect method to connect to the server

mongoose
  .connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    // mongoose.set("debug", true);
    const app = express();
    app.use(cors());

    app.use(express.json()); // we allow our server to parse json as input

    app.use("/api/merchant", merchantRoutes); // definition of routes via URL
    app.use("/api/user", userRoutes);
    app.use("/api/order", orderRoutes);
    app.use("/api/message", messageRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api", authRoutes);

    // state update to Order every day at midnight on "cancel"

    cron.schedule("0 0 * * 0-7", async () => {
      const order = await Order.findOneAndUpdate(
        { state: "pendingMerchant" },
        { state: "cancel" },
        { new: true }
      );
    });
    app.listen(PORT, () => {
      console.log(`Server has started at : http://localhost:${PORT}`);
    });
  })

  .catch((err) => {
    console.error("Database connection error", err);
  });
