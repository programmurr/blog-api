require("dotenv").config();
const jwt = require("jsonwebtoken");
const passport = require("passport");

exports.login = async (req, res) => {
  passport.authenticate("local", { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        message: "Something is not right",
        user,
      });
    }
    req.login(user, { session: false }, (error) => {
      if (error) {
        res.send(error);
      }
      const token = jwt.sign({ user }, process.env.SECRET_KEY);
      return res.json({ user, token });
    });
  })(req, res);
};
