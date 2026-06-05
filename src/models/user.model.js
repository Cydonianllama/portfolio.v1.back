import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({

  id: {
    type: String,
    required: true,
    trim: true
  },

  status: {
    type: Number, //1 actived - 2 desactivated
    required: true,
    trim: true,
  },

  isVerified: {
    type: Boolean, 
    required: true,
    trim: true,
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

  optValidationCode: {
    type: String,
    required: false,
    trim: true
  },

  validationOptDate: {
    type: Date,
    required: false,
  },

});

const User = mongoose.model("User", userSchema);

export default User;