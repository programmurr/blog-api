const mongoose = require("mongoose");
const { Schema } = mongoose;

const articleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: new Date(),
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  published: {
    type: Boolean,
    default: false,
  },
});

articleSchema.virtual("url").get(function () {
  return `/articles/${this._id}`;
});

module.exports = mongoose.model("Article", articleSchema);
