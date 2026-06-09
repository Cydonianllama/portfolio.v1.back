export interface IUser {
  id: string;
  status?: UserStatus;
  isVerified?: boolean;
  email?: string;
  fullname?: string;
  username?: string;
  password?: string;
  creationDate?: Date;
  optValidationCode?: string;
  validationOptDate?: Date;
}

export enum UserStatus {
  actived = 1,
  desactivated = 2,
}