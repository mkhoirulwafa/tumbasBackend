const express = require("express");
const router = express.Router();
const { Orders } = require("../models/order");

router.get(`/`, async (req, res) => {
  const productList = await Orders.find();
  if (!productList) {
  }
  res.send(productList);
});

module.exports = router;
