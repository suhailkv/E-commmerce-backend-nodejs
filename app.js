const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors());
app.options("*", cors());

require("dotenv/config");
const api = process.env.APP_URL;

// middlewares
app.use(bodyParser.json());
app.use(morgan("tiny"));

// routes
const productsRouter = require("./routers/products");
const categoriesRouter = require("./routers/categories");
const usersRouter = require("./routers/users");
const ordersRouter = require("./routers/orders");
// routes
app.use(`${api}/product`, productsRouter);
app.use(`${api}/category`, categoriesRouter);
app.use(`${api}/user`, usersRouter);
app.use(`${api}/order`, ordersRouter);

// batabase connection
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "eshope-database",
  })
  .then(() => {
    console.log("database connection successfully enabled");
  })
  .catch((err) => {
    console.error(err);
  });

app.listen(3000, () => {
  console.log("server working perfectly");
});
