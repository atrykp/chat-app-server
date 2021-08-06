const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    conversationId: {
      type: String,
      require: true,
    },
    sender: {
      type: String,
      require: true,
    },
    text: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    messageDate: {
      type: Number,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
