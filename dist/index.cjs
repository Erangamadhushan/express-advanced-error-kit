"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ApiError: () => ApiError,
  asyncHandler: () => asyncHandler,
  errorMiddleware: () => errorMiddleware,
  notFoundMiddleware: () => notFoundMiddleware
});
module.exports = __toCommonJS(index_exports);

// src/asyncHandler.ts
var asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// src/ApiError.ts
var ApiError = class extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
};

// src/errorMiddleware.ts
var errorMiddleware = (err, req, res, next) => {
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
    ...isProduction ? {} : { stack: err.stack }
  });
};

// src/notFoundMiddleware.ts
var notFoundMiddleware = (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ApiError,
  asyncHandler,
  errorMiddleware,
  notFoundMiddleware
});
