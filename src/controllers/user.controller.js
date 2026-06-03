import express from "express";
import User from "../models/user.model.js";
import Workspace from "../models/workspace.model.js";
import { v4 as uuidv4 } from "uuid";
import { websocket } from "../setup.websocket.js";
import { hashPassword } from "../utils/crypt.js";
import { ToUserDTO } from "../mappers/user.js";

const router = express.Router();

/* listar los usuarios */
router.get("/", async (req, res) => {
  try {
    const {  } = req.params;

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 20);

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find({  })
        .sort({ creationDate: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments({  })
    ]);

    res.json({
      status: true,
      data: users.map(ToUserDTO),
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

/* crear user */
router.post("/", async (req, res) => {
  try {
    const { fullname, username, password, email } = req.body;

    const finalPassword = await hashPassword(password);

    const user = new User({ fullname, username, password: finalPassword, email, id: uuidv4() });
    await user.save();

    res.status(201).json({ status: true, data: user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

/* eliminar user */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res.json({ status: true, data: user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

/* listar user */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res.json({ status: true, data: user });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

/* asociar user con workspace */
router.post("/:userId/workspaces/:workspaceId", async (req, res) => {
  try {
    const { userId, workspaceId } = req.params;

    console.log({ userId, workspaceId })

    const user = await User.findOne({ id: userId });
    const workspace = await Workspace.findOne({ id: workspaceId });

    if (!user || !workspace) {
      return res.status(404).json({
        status: false,
        message: "User or Workspace not found"
      });
    }

    workspace.mainUserId = user.id;

    await workspace.save();

    res.json({
      status: true,
      data: {
        user,
        workspace
      }
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
});


export default router;