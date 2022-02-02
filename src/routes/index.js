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

router.delete(
  "/articles/:id",
  passport.authenticate("jwt", { session: false }),
  articleController.article_delete_post
);

router.put(
  "/articles/:id",
  passport.authenticate("jwt", { session: false }),
  articleController.article_update_put
);

// USER ROUTES
router.post("/signup", userController.user_create_post);

router.get(
  "/users/:id",
  passport.authenticate("jwt", { session: false }),
  userController.user_detail
);

// COMMENT ROUTES
router.get("/articles/:id/comments", commentController.article_comments_get);

router.post(
  "/articles/:id/comments",
  passport.authenticate("jwt", { session: false }),
  commentController.comment_create_post
);

router.delete(
  "/comments/:id",
  passport.authenticate("jwt", { session: false }),
  commentController.comment_delete
);

// COMMENTS
// /comments/:id UPDATE GET - PROTECTED - AUTHOR
// /comments/:id UPDATE PUT - PROTECTED - AUTHOR

module.exports = router;
