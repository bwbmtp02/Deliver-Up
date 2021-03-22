const express = require("express");
const Order = require("../models/Order");
const router = express.Router();
var cors = require("cors");
const check = require("../middlewares/secureOrder");

router.use(cors());

// id => reference to order id
// user => reference to user id
// token => reference to user token

/////---------- CREATE ORDER ---------/////
router.post("/new/:user/:token", check.secure, async (req, res) => {
    const order = new Order({
        state: req.body.state,
        location: { type: "Point", coordinates: req.body.location },
        user: req.body.user,
        merchant: req.body.merchant,
        deliverer: req.body.deliverer,
        products: req.body.products,
        timeSlot: req.body.timeSlot,
    });
    //   console.log(req.body);
    await order.save();
    res.send(order);
});

//////---------- UPDATE ORDER STATE ----------/////
// ---("awaitingDelevery", "pendingDeliverer", "pendingMerchant", "cancel") ---//
router.patch("/update/:id/:user/:token", check.secure, async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true }) ;
        if (!order) throw Error("Something went wrong while Update order");
        res.status(200).json(order);
    } catch (err) {
        res.status(200);
        res.send({ error: "Order doesn't exist !" });
    }
});

/////---------- GET ORDER BY ID ORDER ----------/////
router.get("/:id/:user/:token", check.secure, async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id });
        if (!order) throw Error();
        res.send(order);
    } catch {
        res.status(200);
        res.send({ error: "Order doesn't exist !" });
    }
});

/////----------GET ORDER BY ID USER ----------/////
router.get("/:user/:token", check.secure, async (req, res) => {
    try {
        const order = await Order.find({
            "user.idUser": req.params.user,
        });
        if (!order) throw Error();
        res.send(order);
    } catch {
        res.status(200);
        res.send({ error: "Order doesn't exist !" });
    }
});

/////---------- DELETE ORDER ----------/////
router.delete("/delete/:id/:user/:token", check.secure, async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) throw Error("Something went wrong while Update order");
        res.status(200).json(order);
    } catch (err) {
        res.status(200);
        res.send({ error: "Order doesn't exist !" });
    }
});

module.exports = router;
