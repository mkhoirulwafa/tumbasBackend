const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  apartment: {
    type: String,
    default: "",
  },
  street: {
    type: String,
    default: "",
  },
  zip: {
    type: String,
    required: "",
  },
  city: {
    type: String,
    required: "",
  },
  country: {
    type: String,
    required: "",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
});

usersSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
usersSchema.set("toJSON", { virtuals: true });
exports.Users = mongoose.model("Users", usersSchema);
