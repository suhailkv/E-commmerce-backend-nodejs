const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  const userList = await User.find();
  res.send(userList);
});
router.post("/", async (req, res) => {
  // validation
  if (
    req.body.name == "" ||
    req.body.email == "" ||
    req.body.passwordHash == "" ||
    req.body.phone == ""
  ) {
    res.status(500).json({ success: false, message: "validation error" });
  }
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
  });
  user = await user.save();
  if (!user) {
    res.status(500).json({ success: false, message: "User not created" });
  }
  res.send(user);
});
module.exports = router;
