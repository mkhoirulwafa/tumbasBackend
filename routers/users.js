const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Users } = require("../models/user");

router.get(`/`, async (req, res) => {
  const usersList = await Users.find().select("-password");
  if (!usersList) {
    res.status(404).json({ message: "Empty User List", success: false });
  }
  res.send(usersList);
});

router.get(`/:id`, async (req, res) => {
  const user = await Users.findById(req.params.id).select("-password");
  if (!user) {
    res.status(404).json({ message: "User Not Found", success: false });
  }
  res.send(user);
});

router.post(`/`, async (req, res) => {
  let user = new Users({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    apartment: req.body.apartment,
    street: req.body.street,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
    isAdmin: req.body.isAdmin,
  });
  user = await user.save();
  if (!user) {
    return res.status(500).send("Register User cannot be Success!");
  }
  res.status(201).json(user);
});

router.post(`/login`, async (req, res) => {
  const user = await Users.findOne({ email: req.body.email });
  if (!user) {
    return res.status(500).send("User Not Found");
  }
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res.status(200).send({ email: user.email, token: token });
  }
  return res.status(400).send("Login Failed. Email or Password wrong");
});

module.exports = router;
