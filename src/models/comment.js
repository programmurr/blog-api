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
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
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
