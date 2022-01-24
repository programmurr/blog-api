const Comment = require("../models/comment");

exports.comment_get_all = async (req, res) => {
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
