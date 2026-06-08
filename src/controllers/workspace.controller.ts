import express from "express";
import Workspace from "@schemas/workspace.schema.js";
import { v4 as uuidv4 } from "uuid";
import { websocket } from "../setup.websocket.js";

const router = express.Router();

/* listar los workspaces */
router.get("/", async (req, res) => {
  try {
    const { userId, query } = req.query;

    let filter: any = {}

    if (userId) {
      filter.mainUserId = userId
    }

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        // { fullname: { $regex: query, $options: "i" } }
      ];
    }

    const page = Math.max(1, parseInt(String(req.query.page)) || 1);
    const limit = Math.max(1, parseInt(String(req.query.limit)) || 20);

    const skip = (page - 1) * limit;

    const [workspaces, total] = await Promise.all([
      Workspace.find(filter)
        .sort({ creationDate: -1 })
        .skip(skip)
        .limit(limit),
      Workspace.countDocuments(filter)
    ]);

    res.json({
      status: true,
      data: workspaces,
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

/* crear workspace */
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    const workspace = new Workspace({ name, id: uuidv4() });
    await workspace.save();

    res.status(201).json({ status: true, data: workspace });
  } catch (error) {
    res.status(500).json({ status: false, message: error instanceof Error ? error.message : "Internal Server Error" });
  }
});

/* eliminar workspace */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const workspace = await Workspace.findByIdAndDelete(id);

    if (!workspace) {
      return res.status(404).json({ status: false, message: "Workspace not found" });
    }

    res.json({ status: true, data: workspace });
  } catch (error) {
    res.status(500).json({ status: false, message: error instanceof Error ? error.message : "Internal Server Error" });
  }
});

/* listar workspace */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const workspace = await Workspace.findById(id);

    if (!workspace) {
      return res.status(404).json({ status: false, message: "Workspace not found" });
    }

    res.json({ status: true, data: workspace });
  } catch (error) {
    res.status(500).json({ status: false, message: error instanceof Error ? error.message : "Internal Server Error" });
  }
});

export default router;