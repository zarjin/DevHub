import { z } from "zod";

export const registerValidationSchema = z.object({
  user_name: z
    .string()
    .trim()
    .min(3, {
      message: "Username must be at least 3 characters long",
    })
    .max(30, {
      message: "Username cannot exceed 30 characters",
    }),

  email: z.email({
    error: "Please enter a valid email address",
  }),

  password_hash: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});

export const loginValidationSchema = z.object({
  email: z.email({
    error: "Please enter a valid email address",
  }),

  password_hash: z.string().min(1, {
    message: "Password is required",
  }),
});
