const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const { Product } = require("../models/product");
const mongoose = require("mongoose");

// GET ALL PRODUCT WITH FILTER CATEGORY
router.get(`/`, async (req, res) => {
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }

  const productList = await Product.find(filter).populate("category");
  if (!productList) {
    return res.status(404).send("Product Not Found");
  }
  return res.send(productList);
});

// GET PRODUCT BY ID
router.get(`/:id`, async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");
  if (!product) {
    return res.status(404).send("Product with id Not Found");
  }
  return res.send(product);
});

// GET COUNT OF PRODUCT
router.get(`/get/count`, async (req, res) => {
  const productCount = await Product.countDocuments((count) => count);
  if (!productCount) {
    return res.status(404).send("Product Empty");
  }
  return res.send({
    productCount: productCount,
  });
});

// GET FEATURED PRODUCT
router.get(`/get/featured/:limit`, async (req, res) => {
  const limit = req.params.limit ? req.params.limit : 0;
  const product = await Product.find({ isFeatured: true }).limit(+limit);
  if (!product) {
    return res.status(404).send("Nothing Featured Product Now");
  }
  return res.send(product);
});

// CREATE PRODUCT
router.post(`/`, async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).send("Invalid Category");
  }
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    images: req.body.images,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });
  product = await product.save();
  return product
    ? res.status(201).json(product)
    : res
        .status(500)
        .json({ message: "Product cant be created", success: false });
});

// UPDATE PRODUCT
router.put(`/:id`, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Product Id");
  }
  const category = await Category.findById(req.body.category);
  console.log(req.body.category, category);
  if (!category) {
    return res.status(400).send("Invalid Category");
  }
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      images: req.body.images,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );
  if (!product) {
    return res.status(400).send("Product cannot be updated");
  }
  return res.status(201).json(product);
});

// DELETE PRODUCT
router.delete("/:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      return product
        ? res.status(200).json({ success: true, message: "Product is deleted" })
        : res
            .status(404)
            .json({ success: false, message: "Product not found" });
    })
    .catch((err) => {
      return res.status(400).json({ error: err, success: false });
    });
});
module.exports = router;
