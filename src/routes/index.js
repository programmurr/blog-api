const express = require("express");
const router = express.Router();
const passport = require("passport");

const auth = require("./auth");
const userController = require("../controllers/userController");
const articleController = require("../controllers/articleController");

router.get("/", (req, res) => {
  res.json({ message: "Hey there" });
});

router.post("/signup", userController.user_create_post);

router.post("/login", auth.login);

router.post(
  "/create-article",
  passport.authenticate("jwt", { session: false }),
  articleController.article_create_post
);

module.exports = router;
