const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

// Import models
const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
  try {
    // Check if the email doesn't already exist in the database
    const user = await User.findOne({ account: { email: req.fields.email } });
    if (!user) {
      // if it doesn't exist => signup

      // Encrypt the password
      // The level of password encryption, using only MD5 or SHA256 is not sufficient.
      // So we generate a new Salt thanks to the Uid package
      const salt = uid2(16);
      // Then we create we create a new Hash (password + salt) by concatenating the password and the salt
      const hash = SHA256(req.fields.password + salt).toString(encBase64);
      // We generate also a token that will be used to authenticate the user thanks to the cookies
      const token = uid2(64);

      // Create a new user
      const newUser = new User({
        account: {
          email: req.fields.email,
        },
        email: req.fields.email,
        username: req.fields.username,
        token: token,
        hash: hash,
        salt: salt,
      });

      // Then save the user in the DBB
      await newUser.save();

      // Answer to the client
      res.status(200).json({
        id: newUser._id,
        account: {
          email: newUser.email,
        },
        token: newUser.token,
      });
    } else {
      res.status(409).json({ message: "This email already has an account" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    // Check the user who wants to connect
    const user = await User.findOne({ email: req.fields.email });
    if (user) {
      // Create a new hash with the password with taking :
      // - the salt of the user already saved in the DBB. Remember that this salt is saved in the DBB after the Signup
      // - the password the user is typing..
      const newHash = SHA256(req.fields.password + user.salt).toString(
        encBase64
      );

      // If the hash of the database and the new hash are equals ==> connexion OK
      if (newHash === user.hash) {
        res.status(200).json({
          username: user.username,
          account: user.account,
          token: user.token,
          id: user._id,
        });
      } else {
        res
          .status(401)
          .json({ message: "Unauthorized, the hashes are not equals" });
      }
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
    // If not ==> Unauthorized
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
