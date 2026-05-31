import mongoose from "mongoose";

export const messageSchema = new mongoose.Schema({
  contactId: {
    type: String,
    required: true,
    trim: true
  },

  creationDate: {
    type: Date,
    default: Date.now
  },

  content: {
    type: String,
    required: true
  },

  messageType: {
    type: Number,
    required: true,
    enum: [1, 2, 3] // 1 = contact, 2 = user, 3 = bot
  }
});

const Message = mongoose.model("Message", messageSchema);

export default Message;