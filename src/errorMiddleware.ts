import { Request, Response, NextFunction } from "express";
import { ApiError } from "./ApiError";
import { ErrorMiddlewareOptions } from "./types";

export const errorMiddleware =
  (options: ErrorMiddlewareOptions = {}) =>
  (err: any, req: Request, res: Response, next: NextFunction) => {
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

    if (options.logger) {
      options.logger(err);
    } else {
      console.error(err);
    }

    const handleMongoError = (err: any) => {
      if (err?.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0];
        return new ApiError(400, `Duplicate value for field: ${field}`);
      }
      return null;
    };

    const mongoError = handleMongoError(err);
    if (mongoError) {
      statusCode = mongoError.statusCode;
      message = mongoError.message;
    }

    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      ...(options.showStack && !isProduction ? { stack: err.stack } : {}),
    });
  };
