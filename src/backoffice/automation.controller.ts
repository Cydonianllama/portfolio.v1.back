import express from "express";
import Automation from 'schemas/automation.schema.js'
import { type Request, type Response } from "express";

const router = express.Router();

/* list automations */
router.get('/', async (req: Request, res: Response) => {
  try {

    const { query } = req.query
    const { } = req.params;

    const page = Math.max(1, parseInt(String(req.query?.page) || '') || 1);
    const limit = Math.max(1, parseInt(String(req.query?.limit) || '') || 20);

    const skip = (page - 1) * limit;

    let filter: any = {}

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
      message: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
})


export default router;