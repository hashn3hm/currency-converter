import jwt from "jsonwebtoken";
import AuthConfig from "../../config/authConfig";


export interface JwtPayload {
  id: string;
  email: string;
}

export const generateToken = (payload: JwtPayload) => {
  if (!AuthConfig.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  const token = jwt.sign(payload, AuthConfig.JWT_SECRET, { expiresIn: `2d` });

  return token
};


