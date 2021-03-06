const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  articles: [
    {
      type: Schema.Types.ObjectId,
      ref: "Article",
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  admin: {
    type: Boolean,
    default: false,
  },
});

userSchema.virtual("url").get(function () {
  return `/users/${this._id}`;
});

module.exports = mongoose.model("User", userSchema);
