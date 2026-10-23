import { verifyToken } from "../utils/jwt.ts";
import type { IAuthReq } from "../types/type.ts";
import type { NextFunction, Response } from "express";

export const authorization = (
  req: IAuthReq,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const tokenMatch = authHeader?.match(/^Bearer\s+(\S+)$/i);

  if (!tokenMatch) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Missing or invalid token format" });
  }

  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!secret) {
    return res
      .status(500)
      .json({ message: "Authentication is not configured." });
  }

  try {
    const decoded = verifyToken(tokenMatch[1], secret);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.id !== "string" ||
      typeof decoded.email !== "string" ||
      typeof decoded.role !== "string"
    ) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
