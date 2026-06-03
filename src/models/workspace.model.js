import mongoose from "mongoose";

export const workspaceSchema = new mongoose.Schema({

  id: {
    type: String,
    required: true,
    trim: true
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  mainUserId: {
    type: String,
    required: false,
    trim: true
  },

  creationDate: {
    type: Date,
    default: Date.now
  },

});

const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;