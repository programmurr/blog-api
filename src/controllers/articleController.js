const Article = require("../models/article");
const User = require("../models/user");
const Comment = require("../models/comment");

const { body, validationResult } = require("express-validator");

exports.articles_get = async (req, res, next) => {
  try {
    const articles = await Article.find()
      .populate("author", "username")
      .sort({ timestamp: -1 })
      .exec();
    return res.status(200).json({ articles });
  } catch (error) {
    return next(error);
  }
};

exports.article_detail = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate("author")
      .exec();
    return res.status(200).json({ article });
  } catch (error) {
    return next(error);
  }
};

exports.article_create_post = [
  body("title", "Article title cannot be left blank")
    .trim()
    .isLength({ min: 3, max: 300 })
    .withMessage("Title must be between 3 and 300 characters")
    .escape(),
  body("body", "Article body cannot be left blank")
    .trim()
    .isLength({ min: 1, max: 10000 })
    .withMessage("Article must be between 1 and 10000 characters")
    .escape(),
  async (req, res, next) => {
    const { title, body } = req.body;
    const { user } = req;
    const errors = validationResult(req);
    const newArticle = new Article({
      title,
      body,
      author: user._id,
    });
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Error validating Article data",
        article: { title, body },
        errors: errors.array(),
      });
    } else {
      try {
        await newArticle.save();
        user.articles.push(newArticle._id);
        await User.findByIdAndUpdate(user._id, user).exec();
        return res
          .status(200)
          .json({ article: newArticle, articleUrl: newArticle.url });
      } catch (error) {
        return next(error);
      }
    }
  },
];

exports.article_delete_post = async (req, res) => {
  const article = await Article.findById(req.params.id)
    .populate("author", "articles")
    .exec();
  const author = article.author;
  if (req.user.admin) {
    try {
      const updatedArticles = author.articles.filter((authorArticle) => {
        return authorArticle._id.toString() !== req.params.id;
      });
      author.articles = updatedArticles;
      await User.findByIdAndUpdate(author._id, {
        articles: updatedArticles,
      }).exec();
      await Comment.deleteMany({ article: req.params.id }).exec();
      await Article.findByIdAndRemove(req.params.id).exec();
      return res.status(200).json({ message: "Article deleted" });
    } catch (error) {
      return res.status(500).json({
        message: "Error deleting article",
        error,
      });
    }
  }
};

exports.article_update_put = [
  body("title", "Article title cannot be left blank")
    .trim()
    .isLength({ min: 3, max: 300 })
    .withMessage("Title must be between 3 and 300 characters")
    .escape(),
  body("body", "Article body cannot be left blank")
    .trim()
    .isLength({ min: 1, max: 10000 })
    .withMessage("Article must be between 1 and 10000 characters")
    .escape(),
  async (req, res) => {
    if (req.user.admin) {
      const { title, body, published } = req.body;
      const { user } = req;
      const errors = validationResult(req);
      const updatedArticle = new Article({
        title,
        body,
        published: published === "on" ? true : false,
        author: user._id,
        _id: req.params.id,
      });
      try {
        if (!errors.isEmpty()) {
          return res.status(400).json({
            message: "Invalid article data",
            article: updatedArticle,
            errors: errors.array(),
          });
        }
        await Article.findByIdAndUpdate(req.params.id, updatedArticle).exec();
        return res.status(200).json({
          message: "Article successfully updated",
          article: updatedArticle,
        });
      } catch (error) {
        return res.status(500).json({
          message: "Error updating article",
          error,
        });
      }
    } else {
      return res.status(403).json({
        message: "Not authorized to update Article status",
      });
    }
  },
];
