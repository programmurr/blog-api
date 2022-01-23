const createError = require("http-errors");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./src/routes/index");

const app = express();

// Add production URL later when ready
const url = process.env.DEV_URL;
mongoose.connect(url);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error: "));

require("./src/passport");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.listen(process.env.PORT, () => {
  console.log("Server is listening on port " + process.env.PORT);
});
