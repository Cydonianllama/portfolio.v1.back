import express from "express";
import Workspace from "../models/workspace.model.js";
import { v4 as uuidv4 } from "uuid";
import { websocket } from "../setup.websocket.js";
import User from "../models/user.model.js";
import { ToUserDTO } from "../mappers/user.js";

const router = express.Router();

/* listar los usuarios para admin */
router.get("/users", async (req, res) => {
  try {
    const { query } = req.query
    const { } = req.params;

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 20);

    const skip = (page - 1) * limit;

    let filter = {}

    if (query) {
      filter.$or = [
        { fullname: { $regex: query, $options: "i" } }
      ]
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ creationDate: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter)
    ]);

    // armar output
    const usersToSend = []

    for (let _ of users) {
      // listar length workspaces
      const counter = await Workspace.countDocuments({ mainUserId: _.id })

      usersToSend.push({
        ...ToUserDTO(_),
        qtyWorkspaces: counter
      })
    }

    res.json({
      status: true,
      data: usersToSend,
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



export default router;