import jwt from "jsonwebtoken";
import User from '../schemas/user.schema.js'
import { type Response, type Request, type NextFunction } from "express";
import { UserStatus, type IUser } from "models/user.model.js";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const token =
      authHeader.split(" ")[1];

    const payload = jwt.verify(
      token || '',
      process.env.JWT_SECRET || ''
    );
    
    let payloadUser = payload as { userId: string }

    // listar la data del usuario
    const user = await User.findOne({ id: payloadUser?.userId || '', status: UserStatus.actived })

    if (!user){
      res.status(404).json({ status: false, message: 'User not found', origin: 'auth'})
      return;
    }

    req.user = user.toObject() as IUser;

    next();

  } catch {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
};