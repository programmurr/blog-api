const mongoose = require("mongoose");
const { Schema } = mongoose;
const { format } = require("date-fns");

const postSchema = new Schema({
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

postSchema.virtual("url").get(function () {
  return `/posts/${this._id}`;
});

postSchema.virtual("date").get(function () {
  return format(this.timestamp, "H:mmbb, dd/MM/yyyy");
});

module.exports = mongoose.model("Post", postSchema);
