export interface IAutomation {
  id: string;
  title: string;
  status: AutomationStatus;
  workspaceId: string;
  creationUserId: string
  creationDate?: Date;
}

export enum AutomationStatus {
  draft = 3,
  archived = 2,
  published = 1
}