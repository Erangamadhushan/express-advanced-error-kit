# express-advanced-error-kit

Advanced TypeScript-based error handling middleware for Express.js.

![npm version](https://img.shields.io/npm/v/express-advanced-error-kit)
![npm downloads](https://img.shields.io/npm/dm/express-advanced-error-kit)

![CI](https://github.com/Erangamadhushan/express-advanced-error-kit/actions/workflows/ci.yml/badge.svg)


## Features

- Async handler wrapper
- Custom ApiError class
- Global error middleware
- 404 not found middleware
- Production-safe stack hiding
- ESM + CommonJS support
- Full TypeScript definitions

---

## Installation

```bash
npm install express-advanced-error-kit
```

## Usage

```ts
import express from "express";
import {
  asyncHandler,
  ApiError,
  notFoundMiddleware,
  errorMiddleware
} from "express-advanced-error-kit";

const app = express();

app.get(
  "/error",
  asyncHandler(async () => {
    throw new ApiError("Something went wrong", 400);
  })
);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(5000);

```