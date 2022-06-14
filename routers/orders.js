const express = require("express");
const router = express.Router();
const { Order } = require("../models/order");
const { OrderItem } = require("../models/orderItem");

router.get("/", async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "name")
    .populate({ path: "orderItems", populate: "product" })
    .sort({ dateCreated: -1 });
  res.send(orderList);
});
router.post("/", async (req, res) => {
  let orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let orderItems = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      orderItems = await orderItems.save();
      return orderItems._id;
    })
  );

  const orderItemsResolved = await orderItemsIds;
  let totalPrice = await Promise.all(
    orderItemsResolved.map(async (orderItemsId) => {
      const orderItem = await OrderItem.findById(orderItemsId).populate(
        "product",
        "price"
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );
  console.log(totalPrice);
  totalPrice = totalPrice.reduce((a, b) => a + b, 0);
  let order = new Order({
    orderItems: orderItemsResolved,
    shippingAdress1: req.body.shippingAdress1,
    shippingAdress2: req.body.shippingAdress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });

  order = await order.save();
  res.send(order);
});
router.put("/:id", async (req, res) => {
  let order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );
  order = await order.save();
  res.send(order);
});
router.delete("/:id", async (req, res) => {
  const order = Order.findByIdAndRemove(req.params.id);
  if (!order) {
    res.status(404).send("Order not deleted");
  }
  order.orderItems.map(async (orderItem) => {
    const deleteOrder = await orderItem.findByIdAndRemove(orderItem);
    if (!deleteOrder) {
      res.status(404).send("Order not deleted");
    }
  });

  res.send("Order deleted successfully");
});
router.get("/totalsales", async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
  ]);
  if (!totalSales) {
    res.status(404).res.send({ message: "Total sales cant be generated" });
  }
  res.send({ totalSales: totalSales });
});
router.get("/get/userorders/:id", async (req, res) => {
  const userOrders = await Order.find({ user: req.params.id })
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    })
    .sort({ dateOrdered: -1 });
  if (!userOrders) {
    res.send({ message: "Error happened" });
  }
  res.send({ userOrders: userOrders });
});

module.exports = router;
