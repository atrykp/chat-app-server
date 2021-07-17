const express = require("express");
const protect = require("../middlewares/protect");
const message = require("../controllers/messageControllers");
const messageRoute = express.Router();

messageRoute.route("/").post(protect, message.createMessage);
messageRoute.get("/:id", protect, message.getMessages);

module.exports = messageRoute;
