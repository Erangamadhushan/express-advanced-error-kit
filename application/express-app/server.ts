import express from "express";
import mongoose from "mongoose";
import { z } from "zod";
import {
  ApiError,
  asyncHandler,
  errorMiddleware,
} from "@erangamadhushan/express-advanced-error-kit";
import dotenv from "dotenv";

const app = express();
app.use(express.json());


dotenv.config();

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("Mongo connected"))
  .catch((err) => console.error("Mongo error:", err));

// Simple route
app.get("/error", (req, res) => {
  throw new ApiError(400, "Manual API Error");
});

// Async route
app.get(
  "/async-error",
  asyncHandler(async (req, res) => {
    throw new Error("Async failure");
  }),
);

// Zod validation example
const schema = z.object({
  name: z.string(),
});

app.post(
  "/zod",
  asyncHandler(async (req, res) => {
    schema.parse(req.body);
    res.json({ success: true });
  }),
);

// Mongo duplicate simulation
app.get("/mongo-error", (req, res, next) => {
  const fakeMongoError: any = {
    code: 11000,
    keyValue: { email: "test@test.com" },
  };
  next(fakeMongoError);
});

// 404 fallback
app.use((req, res, next) => {
  next(new ApiError(404, "Route not found"));
});

// Your middleware
app.use(
  errorMiddleware({
    showStack: true,
    logger: (err) => {
      console.log("Custom Logger:", err.message);
    },
  }),
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Demo server running on port ${PORT}`);
});
