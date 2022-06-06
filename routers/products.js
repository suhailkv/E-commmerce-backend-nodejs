const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const { Product } = require("../models/product");

router.get("/", async (req, res) => {
  // filteres products by query parameter( categories?44454,4545454)
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }
  const productList = await Product.find(filter).populate("category");
  console.log(productList.count);
  res.send(productList);
});
router.post("/", async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category)
      res.status(400).json({ success: false, message: "invalid category" });
    let product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDesccription: req.body.richDesccription,
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
    if (!product)
      res.status(404).json({ success: false, message: "Some error occured" });
    res.status(200).send(product);
  } catch (err) {
    res.status(400).json({ success: false, error: err });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) {
      res.status(500).send("Category not found");
    }
    let product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        richDesccription: req.body.richDesccription,
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
    product = await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.id);
    if (!product) {
      res.status(400).json({ success: false, message: "Product not deleted" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});
router.get("/get/count", async (req, res) => {
  const productCount = await Product.countDocuments();
  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.json({ success: true, productCount: productCount });
});
router.get("/get/featured/:count", async (req, res) => {
  const count = req.params.count;
  featuredProducts = await Product.find({ isFeatured: true }).limit(+count);
  if (!featuredProducts) {
    res
      .status(500)
      .json({ success: false, message: "There is no featured products" });
  }
  res.send(featuredProducts);
});

module.exports = router;
