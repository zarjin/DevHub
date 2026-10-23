import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const connectToDatabase = async () => {
  try {
    await pool.connect();
    console.log("Connected to the database successfully.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
};
