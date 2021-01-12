const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Users } = require("../models/user");

router.get(`/`, async (req, res) => {
  const usersList = await Users.find().select("-password");
  if (!usersList) {
    return res.status(404).json({ message: "Empty User List", success: false });
  }
  return res.send(usersList);
});

router.get(`/:id`, async (req, res) => {
  const user = await Users.findById(req.params.id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User Not Found", success: false });
  }
  return res.send(user);
});

router.get(`/get/count`, async (req, res) => {
  const userCount = await Users.countDocuments((count) => count);
  if (!userCount) {
    return res.status(404).send("User Empty");
  }
  return res.send({
    userCount: userCount,
  });
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
  return res.status(201).json(user);
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
        isAdmin: user.isAdmin,
      },
      process.env.SECRET_KEY
      // { expiresIn: "1d" }
    );

    return res.status(200).send({ email: user.email, token: token });
  }
  return res.status(400).send("Login Failed. Email or Password wrong");
});

router.post(`/register`, async (req, res) => {
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
  return res.status(201).json(user);
});

router.put(`/:id`, async (req, res) => {
  const userExist = await Users.findById(req.params.id);
  let newPassword;
  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.password, 10);
  } else {
    newPassword = userExist.password;
  }

  const user = await Users.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      password: newPassword,
      phone: req.body.phone,
      apartment: req.body.apartment,
      street: req.body.street,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
      isAdmin: req.body.isAdmin,
    },
    { new: true }
  );
  if (!user) {
    return res.status(400).send("user cannot be updated");
  }
  return res.status(201).json(user);
});

router.delete("/:id", (req, res) => {
  Users.findByIdAndRemove(req.params.id)
    .then((user) => {
      return user
        ? res.status(200).json({ success: true, message: "user is deleted" })
        : res.status(404).json({ success: false, message: "user not found" });
    })
    .catch((err) => {
      return res.status(400).json({ error: err, success: false });
    });
});

module.exports = router;
