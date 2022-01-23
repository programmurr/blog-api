const express = require("express");
const router = express.Router();
const passport = require("passport");

const auth = require("./auth");
const userController = require("../controllers/userController");
const articleController = require("../controllers/articleController");

router.post("/signup", userController.user_create_post);

router.post("/login", auth.login);
// TODO: IMPLEMENT LOGOUT ON CLIENT SIDE BY DESTORYING TOKEN IN LOCALSTORAGE

router.post(
  "/articles",
  passport.authenticate("jwt", { session: false }),
  articleController.article_create_post
);

// PLANNED ROUTES
// ARTICLES
// /articles GET
// /articles/:id GET
// /articles CREATE GET - PROTECTED - ADMIN
// Finish articles CREATE POST - PROTECTED - ADMIN
// /articles/:id DELETE GET - PROTECTED - ADMIN
// /articles/:id DELETE - PROTECTED - ADMIN
// /articles/:id UPDATE GET - PROTECTED - ADMIN
// /articles/:id UPDATE PUT - PROTECTED - ADMIN

// COMMENTS
// /articles/:id/comments GET
// /comments/:id UPDATE GET - PROTECTED - AUTHOR
// /comments/:id UPDATE PUT - PROTECTED - AUTHOR
// /comments/:id DELETE GET - PROTECTED - AUTHOR/ADMIN
// /comments/:id DELETE - PROTECTED - AUTHOR/ADMIN

// USER
// /users/:id GET - PROTECTED - ADMIN
// /users/:id UPDATE GET - PROTECTED - AUTHOR/ADMIN
// /users/:id UPDATE PUT - PROTECTED - AUTHOR/ADMIN

module.exports = router;
