const express = require("express");
const router = express.Router();
const { Users } = require("../models/user");

router.get(`/`, async (req, res) => {
  const usersList = await Users.find();
  if (!usersList) {
  }
  res.send(usersList);
});

router.post(`/`, async (req, res) => {
  const { name, icon, color } = req.body;
  let user = new Users({
    name: name,
    icon: icon,
    color: color,
  });
  user = await user.save();
  if (!user) {
    return res.status(500).send("Register User cannot be Success!");
  }
  res.status(201).json(user);
});

module.exports = router;
