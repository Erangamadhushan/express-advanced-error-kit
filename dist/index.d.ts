import { Request, Response, NextFunction } from 'express';

declare const asyncHandler: (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => (req: Request, res: Response, next: NextFunction) => void;

declare class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(statusCode: number, message: string, isOperational?: boolean);
}

declare const errorMiddleware: (err: any, req: Request, res: Response, next: NextFunction) => void;

declare const notFoundMiddleware: (req: Request, res: Response, next: NextFunction) => void;

export { ApiError, asyncHandler, errorMiddleware, notFoundMiddleware };
