import type { RequestHandler } from "express";
import { z } from "zod";

export const validate =
  (schema: z.ZodType): RequestHandler =>
  (req, res, next) => {
    void schema
      .safeParseAsync(req.body)
      .then((result) => {
        if (!result.success) {
          res.status(400).json({
            status: "fail",
            errors: result.error.issues.map(({ path, message }) => ({
              path,
              message,
            })),
          });
          return;
        }

        req.body = result.data;
        next();
      })
      .catch(next);
  };
