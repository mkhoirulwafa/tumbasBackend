const express = require("express");
const router = express.Router();
const { Category } = require("../models/category");

// GET ALL CATEGORIES
router.get(`/`, async (req, res) => {
  const categoryList = await Category.find();
  if (!categoryList) {
    res.status(500).json({ message: "Empty Category List", success: false });
  }
  res.status(200).send(categoryList);
});

// GET CATEGORY BY ID
router.get(`/:id`, async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(500).json({
      message: `Category with id ${req.params.id} is not found`,
      success: false,
    });
  }
  res.status(200).send(category);
});

// UPDATE CATEGORY
router.put(`/:id`, async (req, res) => {
  const { name, icon, color } = req.body;
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: name,
      icon: icon,
      color: color,
    },
    { new: true }
  );
  if (!category) {
    return res.status(500).send("Category successfully updated");
  }
  res.status(201).json(category);
});

// CREATE CATEGORY
router.post(`/`, async (req, res) => {
  const { name, icon, color } = req.body;
  let category = new Category({
    name: name,
    icon: icon,
    color: color,
  });
  category = await category.save();
  if (!category) {
    return res.status(500).send("Category cannot be created!");
  }
  res.status(201).json(category);
});

// DELETE CATEGORY
router.delete("/:id", (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      return category
        ? res
            .status(200)
            .json({ success: true, message: "Category is deleted" })
        : res
            .status(404)
            .json({ success: false, message: "Category not found" });
    })
    .catch((err) => {
      return res.status(400).json({ error: err, success: false });
    });
});
module.exports = router;
