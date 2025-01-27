import { Request, Response, NextFunction } from "express";
import redisClient from "../utils/redis";

export const cache = async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;
    const cachedUrl = await redisClient.get(slug);

    if (cachedUrl) {
        return res.redirect(cachedUrl);
    }

    next();
};
