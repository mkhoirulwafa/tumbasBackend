const express = require("express");
const router = express.Router();
const { Orders } = require("../models/order");
const { OrderItem } = require("../models/orderItem");

router.get(`/`, async (req, res) => {
  const orderList = await Orders.find()
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    })
    .sort({ dateOrdered: -1 });
  if (!orderList) {
    res.status(500).json({ message: "Empty Order List", success: false });
  }
  res.send(orderList);
});

router.get(`/:id`, async (req, res) => {
  const order = await Orders.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    });
  if (!order) {
    res.status(500).json({ message: "Empty Order List", success: false });
  }
  res.send(order);
});

router.get(`/get/totalsales`, async (req, res) => {
  const totalSales = await Orders.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);
  if (!totalSales) {
    res
      .status(500)
      .json({ message: "The order sales cannot be generated", success: false });
  }
  res.send({ totalsales: totalSales.pop().totalsales });
});

router.get(`/get/count`, async (req, res) => {
  const orderCount = await Orders.countDocuments((count) => count);
  if (!orderCount) {
    return res.status(404).send("Order Empty");
  }
  return res.send({
    orderCount: orderCount,
  });
});

router.get(`/get/userorders/:id`, async (req, res) => {
  const userOrders = await Orders.find({ user: req.params.id })
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    })
    .sort({ dateOrdered: -1 });
  if (!userOrders) {
    res.status(500).json({ message: "Empty userOrders List", success: false });
  }
  res.send(userOrders);
});

router.post(`/`, async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderitem) => {
      let newOrderItem = new OrderItem({
        quantity: orderitem.quantity,
        product: orderitem.product,
      });
      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );
  const orderItems = await orderItemsIds;

  const totalPrices = await Promise.all(
    orderItems.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );
  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  let order = new Orders({
    orderItems: orderItems,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });
  order = await order.save();
  if (!order) {
    return res.status(500).send("order cannot be created!");
  }
  return res.status(201).json(order);
});

router.put(`/:id`, async (req, res) => {
  const order = await Orders.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );
  if (!order) {
    return res.status(500).send("order successfully updated");
  }
  return res.status(201).json(order);
});

router.delete("/:id", (req, res) => {
  Orders.findByIdAndRemove(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItemId) => {
          await OrderItem.findByIdAndRemove(orderItemId);
        });
        return res
          .status(200)
          .json({ success: true, message: "Order is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ error: err, success: false });
    });
});

module.exports = router;
