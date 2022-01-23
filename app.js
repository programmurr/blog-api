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
app.use("/", routes);

app.listen(process.env.PORT, () => {
  console.log("Server is listening on port " + process.env.PORT);
});
