const mongoose = require("mongoose");

const ordersSchema = mongoose.Schema({
  name: String,
  image: String,
  countInStock: {
    type: Number,
    required: true,
  },
});

exports.Orders = mongoose.model("Orders", ordersSchema);
