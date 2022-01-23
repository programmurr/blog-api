const express = require("express");
const router = express.Router();

// const auth = require("./auth");
const userController = require("../controllers/userController");

router.get("/", (req, res) => {
  res.json({ message: "Hey there" });
});

router.post("/signup", userController.user_create_post);

module.exports = router;
