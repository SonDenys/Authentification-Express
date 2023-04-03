//Import package
const mongoose = require("mongoose");

// Creation model
const User = mongoose.model("User", {
  account: {
    email: {
      unique: true,
      required: true,
      type: String,
    },
  },
  email: String,
  username: String,
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;
