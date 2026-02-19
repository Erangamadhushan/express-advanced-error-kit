import express from "express";
import request from "supertest";
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
  });
});
