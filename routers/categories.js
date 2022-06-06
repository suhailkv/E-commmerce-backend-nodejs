const express = require("express");
const router = express.Router();
const { Category } = require("../models/category");

router.get("/", async (req, res) => {
  try {
    const categoryList = await Category.find();
    if (!categoryList) {
      res.send("Category not found");
    }
    res.send(categoryList);
  } catch (error) {
    res.status(404).json({ success: false, error: err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(400).json({ success: false, message: "no category found" });
    }
    res.status(200).send(category);
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

router.post("/", async (req, res) => {
  try {
    let category = new Category({
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    });
    category = await category.save();
    if (!category) {
      res.status(404).send("some error occured");
    }
    res.status(201).send(category);
  } catch (err) {
    res.status(404).json({ success: false, message: "some error occured" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
      },
      { new: true }
    );
    if (!category) {
      res
        .status(500)
        .json({ success: false, message: "Category cant updated" });
    }
    res.status(200).json({ category });
  } catch (err) {
    res.status(400).json({ success: false, error: err });
  }
});

router.delete("/:id", (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        res
          .status(200)
          .json({ success: true, message: "Category successfully deleted" });
      } else {
        res.json(404).json({ success: false, message: "Category not deleted" });
      }
    })
    .catch((err) => {
      res.status(400).json({ success: false, message: "some error occured" });
    });
});

module.exports = router;
