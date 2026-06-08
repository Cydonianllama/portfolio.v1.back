import express from "express";
import Automation from "../models/message.model.js";
import { v4 as uuidv4 } from "uuid";
import { websocket } from "../setup.websocket.js";
import { CreateAutomation } from '../services/automationService.js'

const router = express.Router();

/* listar automatizaciones dashboard */

/* listar automatizaciones */
router.get("/", async (req, res) => {
  try {
    const { query } = req.query
    const { } = req.params;

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 20);

    const skip = (page - 1) * limit;

    let filter = {}

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } }
      ]
    }

    const [automations, total] = await Promise.all([
      Automation.find(filter)
        .sort({ creationDate: -1 })
        .skip(skip)
        .limit(limit),
      Automation.countDocuments(filter)
    ]);

    res.json({
      status: true,
      data: automations,
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

/* listar automatizacion */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const automation = await Automation.findById(id);

    if (!automation) {
      return res.status(404).json({ status: false, message: "Automation not found" });
    }

    res.json({ status: true, data: automation });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

/* crear automatizacion */
router.post("/", async (req, res) => {
  try {
    const userId = ''

    const { title, workspaceId } = req.body;

    // status: 3 -> draft
    const automationStatus = 3;

    const automation = await CreateAutomation({ id: uuidv4(), title, status: automationStatus, workspaceId, creationUserId: userId })
    
    res.status(201).json({ status: true, data: automation });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

/* actualizar automatizacion */
router.put("/:id", async (req, res) => {
  try {
    //TODO: id de usuario por el token
    const userId = ''

    const { title, workspaceId } = req.body;

    const automation = await Automation.findByIdAndUpdate(
      req.params.id,
      {
        fullname,
        workspaceId
      },
      {
        new: true
      }
    );

    if (!automation) {
      return res.status(404).json({
        status: false,
        error: "Automation not found"
      });
    }

    res.json({
      status: true,
      data: automation
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

/* eliminar automatizacion */
router.delete("/:id", async (req, res) => {
  try {
    console.log('Deleting automation with id:', req.params.id); // Debug log

    const automation = await Automation.findOneAndDelete({ id: req.params.id });

    if (!automation) {
      res.status(404).json({
        status: false,
        error: "Automation not found"
      });
      return;
    }

    res.json({
      status: true
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

export default router;