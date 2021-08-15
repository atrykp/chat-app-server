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
      messageDate: Date.now(),
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

const setIsRead = (io, socket) => {
  socket.on("readMessages", async (data) => {
    const { unreadMessages, socketId } = data;

    const updatedMessages = await Promise.all(
      unreadMessages.map(async (element) => {
        return await Message.findByIdAndUpdate(
          element._id,
          { isRead: true },
          { new: true }
        );
      })
    );
    if (socketId) io.to(socketId).emit("displayedMessages", updatedMessages);
  });
};

const isUserTyping = (io, socket) => {
  socket.on("writing", (data) => {
    io.to(data.socketId).emit("typing", data.conversationId);
  });
};

module.exports.getMessages = getMessages;
//socket
module.exports.handleSendMessage = handleSendMessage;
module.exports.unreadMessages = unreadMessages;
module.exports.setIsRead = setIsRead;
module.exports.isUserTyping = isUserTyping;
