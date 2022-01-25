const Article = require("../models/article");
const User = require("../models/user");

const { body, validationResult } = require("express-validator");

exports.articles_get = async (req, res, next) => {
  try {
    const articles = await Article.find().sort({ timestamp: -1 }).exec();
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
        return res.status(200).json({ articleUrl: newArticle.url });
      } catch (error) {
        return next(error);
      }
    }
  },
];
