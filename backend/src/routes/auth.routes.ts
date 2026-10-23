import { Router } from "express";
import {
  register,
  login,
  logout,
  generateRefreshTokenToAccessToken,
  authStatusCheck,
} from "../controllers/auth.controller.ts";

import {
  registerValidationSchema,
  loginValidationSchema,
} from "../validation/validation.schema.ts";
import { validate } from "../middlewares/zod.ts";

const authRouter = Router();

authRouter.post("/register", validate(registerValidationSchema), register);
authRouter.post("/login", validate(loginValidationSchema), login);
authRouter.post("/logout", logout);
authRouter.post("/refresh-token", generateRefreshTokenToAccessToken);
authRouter.get("/auth-status", authStatusCheck);

export default authRouter;
