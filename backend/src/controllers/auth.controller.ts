import type { Request, Response } from "express";
import { pool } from "../config/db.ts";
import { hashPassword } from "../utils/bcrypt.ts";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/jwt.ts";
import type { IPayload } from "../types/type.ts";

interface UserRow {
  user_id: number;
  email: string;
  user_role: string;
}

export const register = async (req: Request, res: Response) => {
  try {
    const { user_name, email, password_hash } = req.body;

    const hashedPassword = await hashPassword(password_hash);

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE user_name = $1 OR email = $2",
      [user_name, email],
    );

    if ((existingUser.rowCount ?? 0) > 0) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const newUser = await pool.query(
      "INSERT INTO users (user_name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
      [user_name, email, hashedPassword],
    );

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser.rows[0] });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const existingUser = await pool.query<UserRow>(
      "SELECT * FROM users WHERE email=$1",
      [email],
    );

    const user = existingUser.rows[0];

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const comparePassword = await hashPassword(password);

    if (!comparePassword) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const payload: IPayload = {
      id: String(user.user_id),
      email: user.email,
      role: user.user_role,
    };

    const AccessToken = generateAccessToken(payload);
    const RefreshToken = generateRefreshToken(payload);

    res.cookie("refresh_token", RefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      access_token: AccessToken,
    });
  } catch (error) {}
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {}
};

export const generateRefreshTokenToAccessToken = async (
  req: Request,
  res: Response,
) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    const payload = verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as IPayload;

    if (!payload) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(payload);

    res.status(200).json({ access_token: newAccessToken });
  } catch (error) {
    console.error("Error generating access token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const authStatusCheck = async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!accessToken) {
      return res.status(401).json({ message: "Access token not found" });
    }

    const payload = verifyToken(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string,
    ) as IPayload;

    if (!payload) {
      return res.status(403).json({ message: "Invalid access token" });
    }

    res.status(200).json({
      message: process.env.NODE_ENV === "production",
      user: payload,
      authorized: true,
    });
  } catch (error) {
    console.error("Error checking auth status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
