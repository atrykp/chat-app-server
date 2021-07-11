const User = require("../models/user-models");
const login = (req, res) => {};
const signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    res.send(newUser);
  } catch (error) {
    res.send(error.message);
  }
};

module.exports.login = login;
module.exports.signup = signup;
