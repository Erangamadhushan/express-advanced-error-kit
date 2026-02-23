import express from "express";
import request from "supertest";
import { ZodError, ZodIssueCode } from "zod";

import { ApiError } from "../src/ApiError";
import { errorMiddleware } from "../src/errorMiddleware";

describe("errorMiddleware", () => {
  test("should handle ApiError correctly", async () => {
    const app = express();

    app.get("/error", (req, res, next) => {
      next(new ApiError(400, "Bad Request"));
    });

    app.use(errorMiddleware());

    const res = await request(app).get("/error");

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Bad Request");
  });

  test("should handle unknown errors", async () => {
    const app = express();

    app.get("/error", (req, res, next) => {
      next(new Error("Unexpected"));
    });

    app.use(errorMiddleware());

    const res = await request(app).get("/error");

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Internal Server Error");
  });

  test("should handle MongoDB duplicate key error", async () => {
    const app = express();

    app.get("/error", (req, res, next) => {
      const mongoError: any = new Error("Duplicate key");
      mongoError.code = 11000;
      mongoError.keyValue = { email: "test@example.com" };

      next(mongoError);
    });

    app.use(errorMiddleware());

    const res = await request(app).get("/error");

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("email already exists");
  });

  test("should handle Zod validation error", async () => {
    const app = express();

    app.get("/error", (req, res, next) => {
      const zodError = new ZodError([
        {
          code: ZodIssueCode.invalid_type,
          expected: "string",
          received: "number" as const,
          path: ["email"],
          message: "Expected string",
        },
      ]);

      next(zodError);
    });

    app.use(errorMiddleware());

    const res = await request(app).get("/error");

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("email");
  });
});
