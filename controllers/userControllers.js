const asyncHandler = require("express-async-handler");

const User = require("../models/user-models");
const login = (req, res) => {};

const signup = asyncHandler(async (req, res) => {
  const userExist = await User.findOne({ email: req.body.email });

  if (userExist) {
    res.status(400);
    throw new Error("User already exist");
  }
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  if (!newUser) {
    res.status(400);
    throw new Error("Invalid user data");
  }

  res.status(201).send(newUser);
});

module.exports.login = login;
module.exports.signup = signup;
