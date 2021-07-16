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

module.exports.createMessage = createMessage;
