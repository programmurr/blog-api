const Comment = require("../models/comment");
const Article = require("../models/article");
const User = require("../models/user");

const { body, validationResult } = require("express-validator");

exports.article_comments_get = async (req, res) => {
  try {
    const comments = await Comment.find({ article: req.params.id })
      .populate("author", "username")
      .sort({ timestamp: -1 })
      .exec();
    return res.status(200).json({ comments });
  } catch (error) {
    return res.status(404).json({
      message: "Error getting all article comments",
      errorMessage: error.message,
      errorStack: error.stack,
    });
  }
};

exports.comment_create_post = [
  body("body", "Comment cannot be left blank")
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage("Comment must be between 1 and 1000 characters in length")
    .escape(),
  async (req, res) => {
    const errors = validationResult(req);
    const { body } = req.body;
    const { user } = req;
    const { id } = req.params;
    const newComment = new Comment({
      body,
      article: id,
      author: user._id,
    });
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Error validating comment body",
        commentBody: body,
        errors: errors.array(),
      });
    } else {
      try {
        await newComment.save();
        user.comments.push(newComment._id);
        await User.findByIdAndUpdate(user._id, user).exec();
        // I know it's weird using a callback here, but it lets me update the article easier
        // than awaiting again... I think
        Article.findById(id, (error, article) => {
          if (error) {
            return res.status(500).json({
              message: "Error saving comment",
              comment: newComment,
              errorMessage: error.message,
              errorStack: error.stack,
            });
          }
          article.comments = [...article.comments, newComment._id];
          article.save();
          return res.status(200).json({
            message: "Comment saved successfully",
            articleUrl: article.url,
          });
        });
      } catch (error) {
        return res.status(500).json({
          message: "Error saving comment",
          comment: newComment,
          errorMessage: error.message,
          errorStack: error.stack,
        });
      }
    }
  },
];

exports.comment_delete = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate("author")
      .populate("article")
      .exec();
    if (req.user.admin || comment.author.id === req.user.id) {
      const updatedAuthorComments = comment.author.comments.filter(
        (authorComment) => {
          return authorComment._id.toString() !== req.params.id;
        }
      );
      await User.findByIdAndUpdate(comment.author._id, {
        comments: updatedAuthorComments,
      }).exec();
      await Comment.findByIdAndDelete(req.params.id).exec();
      const updatedArticleComments = comment.article.comments.filter(
        (articleComment) => {
          return articleComment._id.toString() !== req.params.id;
        }
      );
      await Article.findByIdAndUpdate(comment.article._id, {
        comments: updatedArticleComments,
      }).exec();
      return res.status(200).json({ message: "Deleted comment from database" });
    } else {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this comment" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting comment",
      errorMessage: error.message,
      errorStack: error.stack,
    });
  }
};
