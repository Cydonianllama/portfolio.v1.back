import type { IUser } from "models/user.model.ts";

export {}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}