const asyncHandler = require("express-async-handler");
const Message = require("../models/message-model");
const Conversation = require("../models/conversation-models");

const getMessages = asyncHandler(async (req, res) => {
  const conversationId = req.params.id;
  const messages = await Message.find({ conversationId });
  if (!messages) {
    res.status(404);
    throw new Error("couldnt find conversation");
  }
  res.send(messages);
});

const updateMessages = asyncHandler(async (req, res) => {
  const updatedMessages = await Promise.all(
    req.body.map(async (element) => {
      return await Message.findByIdAndUpdate(
        element._id,
        { isRead: true },
        { new: true }
      );
    })
  );

  res.send(updatedMessages);
});

//socket

const handleSendMessage = (io, socket) => {
  socket.on("sendMessage", async (message) => {
    const {
      conversationId,
      senderId,
      message: text,
      senderSocketId,
      receiverId,
      receiverSocketId,
    } = message;

    const newMessage = await Message.create({
      conversationId,
      sender: senderId,
      text,
    });

    if (!newMessage) {
      throw new Error("couldnt send message");
    } else {
      io.to(senderSocketId).emit("messageSent", newMessage);
    }
    if (receiverSocketId)
      io.to(message.receiverSocketId).emit("getMessage", newMessage);
  });
};

const unreadMessages = (io, socket) => {
  socket.on("getUnread", async (userId) => {
    const unread = {};
    const conversations = await Conversation.find({
      members: { $in: [userId] },
    });

    const conversationsId = conversations.map((element) => element._id);
    for (let element of conversationsId) {
      const messagesArr = await Message.find({
        conversationId: element,
        isRead: false,
        sender: { $ne: userId },
      });
      if (messagesArr.length > 0) {
        unread[element] = messagesArr;
      }
    }
    io.to(socket.id).emit("unread", unread);
  });
};

module.exports.getMessages = getMessages;
module.exports.updateMessages = updateMessages;
//socket
module.exports.updateMessages = updateMessages;
module.exports.handleSendMessage = handleSendMessage;
module.exports.unreadMessages = unreadMessages;
