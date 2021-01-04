const express = require("express");
const router = express.Router();
const { Users } = require("../models/user");

router.get(`/`, async (req, res) => {
  const productList = await Users.find();
  if (!productList) {
  }
  res.send(productList);
});

module.exports = router;
