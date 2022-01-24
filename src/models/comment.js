const mongoose = require("mongoose");
const { Schema } = mongoose;
const { format } = require("date-fns");

const commentSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: new Date(),
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: "Article",
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

commentSchema.virtual("date").get(function () {
  return format(this.timestamp, "H:mmbb, dd/MM/yyyy");
});

module.exports = mongoose.model("Comment", commentSchema);
