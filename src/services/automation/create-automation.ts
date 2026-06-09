import type { IAutomation } from "models/automation.js";
import Automation from "schemas/automation.schema.js";

export const CreateAutomation = async (data: IAutomation): Promise<IAutomation | null> => {
  const automation = new Automation(data);
  await automation.save();
  return automation;
} 