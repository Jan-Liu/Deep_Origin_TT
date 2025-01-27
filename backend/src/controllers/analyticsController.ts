import { Request, Response } from "express";
import { Url } from "../models/Url";

/**
 * Fetch analytics data for a specific short URL.
 * @param req - Express request object, expecting `slug` as a route parameter.
 * @param res - Express response object.
 */
export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;

    try {
        const url = await Url.findOne({ slug });
        if (!url) {
            res.status(404).json({ error: "URL not found" });
            return;
        }
        res.json({
            originalUrl: url.originalUrl,
            shortUrl: url.shortUrl,
            visitCount: url.visitCount,
            visitors: url.visitors.map((visitor) => ({
                ip: visitor.ip,
                userAgent: visitor.userAgent,
                timestamp: visitor.timestamp,
            })),
        });
    } catch (err) {
        console.error("Error fetching analytics:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};