const express = require("express");
const router = express.Router();
const { Order } = require("../models/order");

router.get("/", async (req, res) => {
  const orderList = await Category.find();
  res.send(orderList);
});
router.post("/", (req, res) => {
  const order = new Category({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });
  order
    .save()
    .then((createdOrder) => {
      res.status(201).json(createdOrder);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});
module.exports = router;
