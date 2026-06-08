import jwt from "jsonwebtoken";
import User from '../schemas/user.schema.js'

export const auth = (
  req,
  res,
  next
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
      token,
      process.env.JWT_SECRET
    );

    req.user = payload;
    
    // listar la data del usuario
    const user = await User.findOne({ id: payload.userId, status: 1 })

    if (!user){
      res.status(404).json({ status: false, message: 'User not found', origin: 'auth'})
      return;
    }

    req.userData = user.toObject();

    next();

  } catch {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
};