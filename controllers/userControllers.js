const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const uploadImage = require("../cloudinary");

const User = require("../models/user-models");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_PASS, {
    expiresIn: "30m",
  });
};
const signup = asyncHandler(async (req, res) => {
  let photoUrl =
    "http://res.cloudinary.com/dxswvlmvl/image/upload/v1626754829/user/xq6byb65z73efkag6t6f.jpg";
  const [photo] = req.files;
  if (photo) {
    const answear = await uploadImage(photo.buffer);
    photoUrl = answear.url;
  }
  const userExist = await User.findOne({ email: req.body.email });

  if (userExist) {
    res.status(400);
    throw new Error("User already exist");
  }
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    profilePicture: photoUrl,
  });

  if (!newUser) {
    res.status(400);
    throw new Error("Invalid user data");
  }
  const token = signToken(newUser._id);
  res.status(201).send({
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    profilePicture: newUser.profilePicture,
    description: newUser.description,
    token,
  });
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

  res.status(200).send({
    _id: user._id,
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture,
    description: user.description,
    token,
  });
});
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    user: {
      username: user.username,
      _id: user._id,
      description: user.description,
      profilePicture: user.profilePicture,
    },
  });
});

const findUsersByUserName = asyncHandler(async (req, res) => {
  const userName = req.params.name;
  const usersList = await User.find({
    username: { $regex: userName, $options: "i" },
  });

  if (!usersList) {
    res.status(404);
    throw new Error("Users not found");
  }

  const users = usersList.map((element) => ({
    userName: element.username,
    profilePicture: element.profilePicture,
    _id: element._id,
  }));
  res.send(users);
});

module.exports.login = login;
module.exports.signup = signup;
module.exports.getUserById = getUserById;
module.exports.findUsersByUserName = findUsersByUserName;
