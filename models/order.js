const mongoose = require("mongoose");

const ordersSchema = mongoose.Schema({
  name: String,
  image: String,
  countInStock: {
    type: Number,
    required: true,
  },
});

ordersSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
ordersSchema.set("toJSON", { virtuals: true });

exports.Orders = mongoose.model("Orders", ordersSchema);
