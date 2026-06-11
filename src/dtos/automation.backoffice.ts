export interface AutomationBackofficeDTO {
  automationId: string;
  title: string;
  creationDate: Date;
  workspaceId: string;
  workspaceName: string;
  userCreationMail: string
  userCreationId: string
}

export interface GetAutomationsBackofiiceResponseDTO{
  list: Array<AutomationBackofficeDTO>
}