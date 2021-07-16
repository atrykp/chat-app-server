const express = require("express");
const message = require("../controllers/messageControllers");
const messageRoute = express.Router();

messageRoute.route("/").post(message.createMessage);

module.exports = messageRoute;
