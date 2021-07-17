const asyncHandler = require("express-async-handler");
const Message = require("../models/message-model");

const createMessage = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const conversationId = req.body.conversationId;
  const message = await Message.create({
    conversationId,
    sender: userId,
    text: req.body.text,
  });

  if (!message) {
    res.status(400);
    throw new Error("couldnt send message");
  }

  res.send(message);
});

const getMessages = asyncHandler(async (req, res) => {
  const conversationId = req.params.id;
  const messages = await Message.find({ conversationId });
  if (!messages) {
    res.status(404);
    throw new Error("couldnt find conversation");
  }
  res.send(messages);
});

module.exports.createMessage = createMessage;
module.exports.getMessages = getMessages;
