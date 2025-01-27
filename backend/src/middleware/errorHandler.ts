import { Request, Response, NextFunction } from "express";

/**
 * Global error-handling middleware.
 * - Logs the error stack to the console for debugging purposes.
 * - Sends a generic 500 Internal Server Error response to the client.
 * @param err - The error object caught by the middleware.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function to pass control to the next middleware if needed.
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
};
