const Conversation = require("../models/conversation-models");

const createConversation = async (req, res) => {
  console.log(req.body.members);

  const conversation = await Conversation.create({
    members: req.body.members,
  });
  res.send(conversation);
};

module.exports.createConversation = createConversation;
