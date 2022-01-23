const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.user_create_post = [
  async (req, res, next) => {
    bcrypt.hash(req.body.password, 10, async (hashError, hashedPassword) => {
      if (hashError) {
        return next(hashError);
      }
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
        posts: [],
        comments: [],
      });
      try {
        await user.save();
        res.json({ message: "User saved to DB", user });
        return;
      } catch (error) {
        return next(error);
      }
    });
  },
];
