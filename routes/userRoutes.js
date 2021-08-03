const express = require("express");
const controller = require("../controllers/userControllers");
const protect = require("../middlewares/protect");

const userRouter = express.Router();

userRouter.delete("/", protect, controller.removeUser);
userRouter.put("/", protect, controller.editUserById);
userRouter.post("/login", controller.login);
userRouter.post("/signup", controller.signup);
userRouter.get("/:id", protect, controller.getUserById);
userRouter.get("/username/:name", protect, controller.findUsersByUserName);

module.exports = userRouter;
