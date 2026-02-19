import { Request, Response, NextFunction } from "express";
import { ApiError } from "./ApiError";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err instanceof ApiError) {
    statusCode = err.statusCode || 500;
    message = err.message || "Internal Server Error";
  }

  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction && statusCode === 500) {
    message = "Internal Server Error";
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
};
