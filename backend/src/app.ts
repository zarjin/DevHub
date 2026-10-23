import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import expressRateLimit from "express-rate-limit";

import { errorHandler } from "./middlewares/errorHandler.ts";
import { notFound } from "./middlewares/notFound.ts";
import { connectToDatabase } from "./config/db.ts";

const app = express();

await connectToDatabase();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(
  expressRateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);
app.use(morgan("dev"));

// Routes

// Error handling
app.use(errorHandler);
app.use(notFound);

export default app;
