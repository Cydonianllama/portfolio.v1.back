import express from "express";
import Workspace from "../models/workspace.model.js";
import { v4 as uuidv4 } from "uuid";
import { websocket } from "../setup.websocket.js";

const router = express.Router();



export default router;