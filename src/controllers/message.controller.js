import express from "express";
import Message from "../models/message.model.js";

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
      message: error instanceof Error ? error.message : "Internal Server Error"
    });
  }
});

/* enviar un mensaje */
router.post("/", async (req, res) => {
  try {
    const { contactId, content, messageType } = req.body;

    const message = new Message({ contactId, content, messageType });
    await message.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;