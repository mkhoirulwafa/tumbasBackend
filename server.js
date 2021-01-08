const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const api = process.env.API_URL;
const port = process.env.PORT;

app.use(cors());
app.options("*", cors());

const productRouter = require("./routers/products");
const ordersRouter = require("./routers/orders");
const usersRouter = require("./routers/users");
const categoriesRouter = require("./routers/categories");
const authJwt = require("./helpers/jwt");

//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(authJwt);

// connect DB
mongoose
  .connect(process.env.CONNECTION_STRING, {
    dbName: "tumbas",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

// Routers
app.use(`${api}/products`, productRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/category`, categoriesRouter);

// app listen
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
