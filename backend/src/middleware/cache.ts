import { Request, Response, NextFunction } from "express";
import redisClient from "../utils/redis";

/**
 * Middleware to check for cached URLs in Redis.
 * - If the URL is cached, redirects the client to the cached URL.
 * - If not, passes control to the next middleware or route handler.
 * @param req - Express request object, expecting `slug` as a route parameter.
 * @param res - Express response object.
 * @param next - Express next function to pass control to the next middleware.
 */
export const cache = async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;
    const cachedUrl = await redisClient.get(slug);

    if (cachedUrl) {
        return res.redirect(cachedUrl);
    }

    next();
};