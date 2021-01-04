const express = require("express");
const router = express.Router();
const { Category } = require("../models/category");

router.get(`/`, async (req, res) => {
  const productList = await Category.find();
  if (!productList) {
  }
  res.send(productList);
});

module.exports = router;
