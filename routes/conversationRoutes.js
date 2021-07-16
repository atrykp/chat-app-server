const express = require("express");
const conversation = require("../controllers/conversationControllers");
const protect = require("../middlewares/protect");
const conversationRoute = express.Router();

conversationRoute
  .route("/")
  .post(protect, conversation.createConversation)
  .get(protect, conversation.getConversation);

module.exports = conversationRoute;
