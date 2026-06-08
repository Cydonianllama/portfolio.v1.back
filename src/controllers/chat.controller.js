import express from "express";
import Message from "../models/message.model.js";
import { v4 as uuidv4 } from "uuid";
import { websocket } from "../setup.websocket.js";
import { openChatQueue } from '../queues/open.chat.queue.js'

const router = express.Router();

router.post('/open/:id', async (req, res) => {
  try {
    await openChatQueue.add("welcome-email", {
      email
    });
  } catch (error) {

  }
})

export default router;