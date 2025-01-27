import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

/**
 * Middleware to authenticate requests using a JWT token.
 * - Extracts the token from the Authorization header.
 * - Verifies the token and attaches the user's ID and role to the request body.
 * @param req - Express request object, expecting an Authorization header.
 * @param res - Express response object.
 * @param next - Express next function to pass control to the next middleware.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
        req.body.userId = decoded.userId;
        req.body.role = decoded.role;
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
};