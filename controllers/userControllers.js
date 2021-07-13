const asyncHandler = require("express-async-handler");
var jwt = require("jsonwebtoken");

const User = require("../models/user-models");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_PASS, {
    expiresIn: "30m",
  });
};
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
  const token = signToken(newUser._id);
  res.status(201).send({ _id: newUser._id, token });
});

const login = asyncHandler(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(400);
    return next(new Error("email and password are required"));
  }

  const user = await User.findOne({ email }).select("+password");

  const isPasswordCorrect = await user.correctPassword(password, user.password);

  if (!user || !isPasswordCorrect) {
    res.status(401);
    return next(new Error("invalid email or password"));
  }
  const token = signToken(user._id);

  res.status(200).send({ _id: user._id, token });
});

module.exports.login = login;
module.exports.signup = signup;
