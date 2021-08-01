const Conversation = require("../models/conversation-models");
const asyncHandler = require("express-async-handler");

const createConversation = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const isExist = await Conversation.findOne({
    members: { $all: [userId, req.body.member] },
  });
  if (isExist) {
    res.send({ _id: isExist._id });
  } else {
    const conversation = await Conversation.create({
      members: [userId, req.body.member],
    });
    if (!conversation) {
      res.status(400);
      throw new Error("Didnt add conversation");
    }
    res.send(conversation);
  }
});

const getConversation = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const conversations = await Conversation.find({ members: { $in: [userId] } });

  res.send(conversations);
});

module.exports.createConversation = createConversation;
module.exports.getConversation = getConversation;
