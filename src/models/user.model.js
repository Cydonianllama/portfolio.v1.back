import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({

  id: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    trim: true
  },


  fullname: {
    type: String,
    required: true,
    trim: true
  },

  username: {
    type: String,
    required: true,
    trim: true
  },

  password: {
    type: String,
    required: true,
    trim: true
  },

  creationDate: {
    type: Date,
    default: Date.now
  },

});

const User = mongoose.model("User", userSchema);

export default User;