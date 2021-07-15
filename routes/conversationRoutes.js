const express = require("express");
const conversation = require("../controllers/conversationControllers");

const conversationRoute = express.Router();

conversationRoute.route("/").post(conversation.createConversation);

module.exports = conversationRoute;
