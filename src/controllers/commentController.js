const Comment = require("../models/comment");

exports.article_comments_get = async (req, res) => {
  try {
    const comments = await Comment.find({ article: req.params.id })
      .populate("author")
      .sort({ timestamp: -1 })
      .exec();
    return res.status(200).json({ comments });
  } catch (error) {
    return res.status(404).json({ error });
  }
};
