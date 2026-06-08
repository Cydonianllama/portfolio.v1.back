import Automation from "schemas/automation.schema.js";

export const CreateAutomation = async (data: any): Promise<any | null> => {
  const automation = new Automation(data);
  await automation.save();
  return automation;
} 