import jwt from 'jsonwebtoken'

export const buildSession = async (dataToSave: { userId: string }) => {
  // armar sesion
    const token = jwt.sign(
      dataToSave,
      process.env.JWT_SECRET || '',
      {
        expiresIn: "7d"
      }
    );

  return token;
}