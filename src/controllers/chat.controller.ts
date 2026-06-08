import express from "express";
import Message from "@models/message.model.js";
import { v4 as uuidv4 } from "uuid";
import { websocket } from "../setup.websocket.js";
// import { openChatQueue } from '../queues/open.chat.queue.js'

const router = express.Router();

/* proceso abrir un chat */
router.get('/open/:contactId', async (req, res) => {
  try {
    // validar usuario

    // validar contacto
    const { contactId } = req.params;

    // enviar proceso de asignacion
    // await openChatQueue.add("welcome-email", {
    //   email
    // });


    // listar los mensajes
    const page = Math.max(1, parseInt(String(req.query.page)) || 1);
    const limit = Math.max(1, parseInt(String(req.query.limit)) || 20);

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      Message.find({ contactId })
        .sort({ creationDate: -1 })
        .skip(skip)
        .limit(limit),
      Message.countDocuments({ contactId })
    ]);

    res.json({
      status: true,
      data: messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1
      }
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: error instanceof Error ? error.message : "Internal Server Error"
    });
  }
})

/* enviar mensaje */
router.post("/send-message", async (req, res) => {
  try {
    const { contactId, content, messageType } = req.body;

    const message = new Message({ contactId, content, messageType, id: uuidv4() });
    await message.save();

    // Emitir evento de nuevo mensaje a través de WebSocket
    websocket?.to(contactId)?.emit("newMessage", { contactId, message });

    res.status(201).json({ status: true, data: message });
  } catch (error) {
    res.status(500).json({ status: false, message: error instanceof Error ? error.message : "Internal Server Error" });
  }
});

export default router;