const asyncHandler = require("express-async-handler");
var jwt = require("jsonwebtoken");

const User = require("../models/user-models");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    res.status(401);
    return next(new Error("You are logged out, please sign in"));
  }
  const decoded = await jwt.verify(token, process.env.JWT_PASS);

  if (!decoded) {
    res.status(401);
    return next(new Error("You don't have access"));
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    res.status(401);
    return next(new Error("not found user with this token"));
  }
  if (user.changesPasswordAfter(decoded.iat)) {
    res.status(401);
    return next(
      new Error("user recently changed password please log in again")
    );
  }
  req.user = user;
  next();
});
