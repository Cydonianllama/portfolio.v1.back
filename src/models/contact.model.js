import mongoose from "mongoose";

export const contactSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },

  creationDate: {
    type: Date,
    default: Date.now
  },

  workspaceId: {
    type: String, // mongoose.Schema.Types.ObjectId,
    required: true
  }
});

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;