# @erangamadhushan/express-advanced-error-kit

Advanced TypeScript-based error handling middleware for Express.js.

![npm version](https://img.shields.io/npm/v/@erangamadhushan/express-advanced-error-kit)
![npm downloads](https://img.shields.io/npm/dm/@erangamadhushan/express-advanced-error-kit)

---

## ✨ Features

- Async handler wrapper
- Custom `ApiError` class
- Global error middleware
- 404 Not Found middleware
- Logger integration (Pino, Winston, custom)
- MongoDB duplicate key smart parsing
- Zod validation error formatting
- Production-safe stack handling
- ESM + CommonJS support
- Full TypeScript support

---

## 📦 Installation

```bash
npm install @erangamadhushan/express-advanced-error-kit
```

# 🚀 Quick Start

```ts
import express from "express";
import {
  asyncHandler,
  ApiError,
  notFoundMiddleware,
  errorMiddleware,
} from "@erangamadhushan/express-advanced-error-kit";

const app = express();
app.use(express.json());

app.get(
  "/error",
  asyncHandler(async () => {
    throw new ApiError("Something went wrong", 400);
  }),
);

app.use(notFoundMiddleware);
app.use(errorMiddleware());

app.listen(5000);
```

# 🧠 Smart MongoDB Error Handling

## Duplicate key errors are automatically formatted:

```ts
// Mongo duplicate key error
{
  code: 11000,
  keyValue: { email: "test@example.com" }
}
```

Response:

```json
{
  "success": false,
  "message": "email already exists"
}
```

# 🧾 Zod Validation Formatting

If using Zod:

```ts
throw new ZodError([...]);
```

Response:

```json
{
  "success": false,
  "message": "email: Invalid email"
}
```

# 🪵 Logger Integration

Use any logger:

```ts
import pino from "pino";

const logger = pino();

app.use(
  errorMiddleware({
    logger: logger.error.bind(logger),
    showStack: false,
  }),
);
```

# 📚 Middleware Order (Important)

```js
app.use(routes);
........
........
app.use(notFoundMiddleware);
app.use(errorMiddleware());
```

# 🧩 Creating Custom Errors

```ts
throw new ApiError(404, "User not found");
```

Also You can extend it:
```ts
class ValidationError extends ApiError {
  constructor(message: string) {
    super(400, message);
  }
}
```

# ⚙️ Configuration Options
```ts
errorMiddleware({
  logger?: (error: any) => void;
  showStack?: boolean;
});
```

# 🛡 Production Behavior

- Stack traces hidden automatically in production
- Clean JSON response format
- Centralized error control

