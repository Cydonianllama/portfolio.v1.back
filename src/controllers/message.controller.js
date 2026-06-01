import express from "express";
import Message from "../models/message.model.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

/* listar los mensajes del chat */
router.get("/:contactId", async (req, res) => {
  try {
    const { contactId } = req.params;

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 20);

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
});

/* enviar un mensaje */
router.post("/", async (req, res) => {
  try {
    const { contactId, content, messageType } = req.body;

    const message = new Message({ contactId, content, messageType, id: uuidv4() });
    await message.save();

    res.status(201).json({ status: true, data: message });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

export default router;