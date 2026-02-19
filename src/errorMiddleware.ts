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
    }
    else {
         console.error(err);
    }

    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      ...(options.showStack && !isProduction ? { stack: err.stack } : {}),
    });
  };
