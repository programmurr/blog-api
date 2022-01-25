const express = require("express");
const router = express.Router();
const passport = require("passport");

const auth = require("./auth");
const userController = require("../controllers/userController");
const articleController = require("../controllers/articleController");
const commentController = require("../controllers/commentController");

router.post("/login", auth.login);
// TODO: IMPLEMENT LOGOUT ON CLIENT SIDE BY DESTORYING TOKEN IN LOCALSTORAGE

// ARTICLE ROUTES

router.get("/articles", articleController.articles_get);

router.post(
  "/articles",
  passport.authenticate("jwt", { session: false }),
  articleController.article_create_post
);

router.get("/articles/:id", articleController.article_detail);

// USER ROUTES
router.post("/signup", userController.user_create_post);

// COMMENT ROUTES
router.get("/articles/:id/comments", commentController.article_comments_get);

router.post(
  "/articles/:id/comments",
  passport.authenticate("jwt", { session: false }),
  commentController.comment_create_post
);

// PLANNED ROUTES
// ARTICLES
// /articles/:id DELETE GET - PROTECTED - ADMIN
// /articles/:id DELETE - PROTECTED - ADMIN
// /articles/:id UPDATE GET - PROTECTED - ADMIN
// /articles/:id UPDATE PUT - PROTECTED - ADMIN

// COMMENTS
// /comments/:id UPDATE GET - PROTECTED - AUTHOR
// /comments/:id UPDATE PUT - PROTECTED - AUTHOR
// /comments/:id DELETE GET - PROTECTED - AUTHOR/ADMIN
// /comments/:id DELETE - PROTECTED - AUTHOR/ADMIN

// USER
// /users/:id GET - PROTECTED - ADMIN
// /users/:id UPDATE GET - PROTECTED - AUTHOR/ADMIN
// /users/:id UPDATE PUT - PROTECTED - AUTHOR/ADMIN

module.exports = router;
