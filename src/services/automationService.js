import Automation from "../models/message.model.js";
import { v4 as uuidv4 } from "uuid";

export const CreateAutomation = async (automation) => {
  const automation = new Automation(automation);
  await automation.save();
  return automation;
} 