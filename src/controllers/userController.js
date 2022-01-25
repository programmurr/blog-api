const User = require("../models/user");
const bcrypt = require("bcryptjs");

const { body, validationResult } = require("express-validator");

function passwordsMatch(value, { req }) {
  if (value !== req.body.password) {
    throw new Error("Passwords do not match");
  }
  return true;
}

exports.user_create_post = [
  body("username", "Username is required")
    .trim()
    .isLength({ min: 3, max: 24 })
    .withMessage("Username must be between 3 and 24 characters")
    .escape(),
  body("password", "Password is required")
    .isLength({ min: 12 })
    .withMessage("Password must be minimum of 12 characters long"),
  body("confirmPassword").custom(passwordsMatch),
  async (req, res, next) => {
    bcrypt.hash(req.body.password, 10, async (hashError, hashedPassword) => {
      if (hashError) {
        return next(hashError);
      }
      const errors = validationResult(req);
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
        posts: [],
        comments: [],
      });
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Error validating user information",
          errors: errors.array(),
        });
      }
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

exports.user_detail = async (req, res) => {
  if (req.user.admin && req.user.id === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({
        message: "Error getting User profile",
        error,
      });
    }
  } else {
    res.status(401).json({
      message: "Unauthorized to view User profile",
    });
  }
};
