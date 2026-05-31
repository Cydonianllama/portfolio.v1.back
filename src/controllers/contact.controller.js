import express from "express";
import Contact from "../models/contact.model.js";

const router = express.Router();

/**
 * GET ALL
 * ?workspaceId=
 */
router.get("/", async (req, res) => {
  try {
    const { workspaceId, query } = req.query;

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 20);

    const skip = (page - 1) * limit;

    const filter = {};

    if (workspaceId) {
      filter.workspaceId = workspaceId;
    }

    if (query) {
      filter.$or = [
        { id: { $regex: query, $options: "i" } },
        { fullName: { $regex: query, $options: "i" } }
      ];
    }

    const [contacts, total] = await Promise.all([
      Contact.find(filter)
        .skip(skip)
        .limit(limit),
      Contact.countDocuments(filter)
    ]);

    res.json({
      status: true,
      data: contacts,
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
      error: error instanceof Error ? error.message : "Internal Server Error"
    });
  }
});

/**
 * GET ONE
 */
router.get("/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        status: false,
        error: "Contact not found"
      });
    }

    res.json({
      status: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

/**
 * CREATE
 */
router.post("/", async (req, res) => {
  try {
    const { fullname, workspaceId } = req.body;

    if (!fullname) {
      return res.status(400).json({
        status: false,
        error: "fullname is required"
      });
    }

    const contact = await Contact.create({
      fullname,
      workspaceId
    });

    res.json({
      status: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

/**
 * UPDATE
 */
router.put("/:id", async (req, res) => {
  try {
    const { fullname, workspaceId } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        fullname,
        workspaceId
      },
      {
        new: true
      }
    );

    if (!contact) {
      return res.status(404).json({
        status: false,
        error: "Contact not found"
      });
    }

    res.json({
      status: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
});

/**
 * DELETE
 */
router.delete("/:id", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        status: false,
        error: "Contact not found"
      });
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