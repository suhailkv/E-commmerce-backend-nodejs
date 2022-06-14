const express = require("express");
const router = express.Router();
const { User } = require("../models/user");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv/config");

router.get("/", async (req, res) => {
  const userList = await User.find(); //.select("-passwordHash")
  res.send(userList);
});
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404).send("Error Occured");
  }
  res.send(user);
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

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404).send("Error Occured");
  }
  if (bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.status(200).send({ data: user.email, token: token });
  } else {
    res.send("Password does not match");
  }
});

router.get("/get/count", async (req, res) => {
  const userCount = await User.countDocuments();
  if (!userCount) {
    res.status(404).send("Error occured");
  }
  res.send({ userCount: userCount });
});

router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user) {
    res.status(400).send("Use not deleted");
  }
  res.send("Item removed");
});
module.exports = router;
