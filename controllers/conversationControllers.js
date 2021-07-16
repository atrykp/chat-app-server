const Conversation = require("../models/conversation-models");
const asyncHandler = require("express-async-handler");

const createConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.create({
    members: req.body.members,
  });
  if (!conversation) {
    res.status(400);
    throw new Error("Didnt add conversation");
  }
  res.send(conversation);
});

const getConversation = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const conversations = await Conversation.find({ members: { $in: [userId] } });
  if (!conversations.length) {
    res.status(404);
    throw new Error("didnt find conversations");
  }
  res.send(conversations);
});

module.exports.createConversation = createConversation;
module.exports.getConversation = getConversation;
