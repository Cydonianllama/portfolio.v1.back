import mongoose from "mongoose";

/*

automation
	id
	title
	creationDate
	status
	workspaceId
	creationUserId

*/


export const automationSchema = new mongoose.Schema({

  id: {
    type: String,
    required: true,
    trim: true
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  creationDate: {
    type: Date,
    default: Date.now
  },

  status: {
    type: Number,  // 3 draft  - 2 archived - 1 published
    required: true
  },

  workspaceId: {
    type: String,
    required: true,
    trim: true
  },
  
  creationUserId: {
    type: String,
    required: true,
    trim: true
  },

  // messageType: {
  //   type: Number,
  //   required: true,
  //   enum: [1, 2, 3] // 1 = contact, 2 = user, 3 = bot
  // }
});

const Automation = mongoose.model("Automation", automationSchema);

export default Automation;