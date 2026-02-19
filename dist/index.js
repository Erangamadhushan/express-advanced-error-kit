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
export {
  ApiError,
  asyncHandler,
  errorMiddleware,
  notFoundMiddleware
};
