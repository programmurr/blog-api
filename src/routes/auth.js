require("dotenv").config();
const jwt = require("jsonwebtoken");
const passport = require("passport");

exports.login = async (req, res) => {
  passport.authenticate("local", { session: false }, (error, user) => {
    if (error) {
      return res.status(404).json({
        message: "Error authenticating user",
        error,
      });
    }
    if (!user) {
      return res
        .status(400)
        .json({ message: "Username or password is incorrect" });
    }
    req.login(user, { session: false }, (error) => {
      if (error) {
        return res
          .status(404)
          .json({ message: "Error logging in User", error });
      }
      const token = jwt.sign({ user }, process.env.SECRET_KEY, {
        expiresIn: "1d",
      });
      // TODO: SAVE TOKEN TO LOCALSTORAGE ON FRONT END!
      return res.status(200).json({ user, token });
    });
  })(req, res);
};
