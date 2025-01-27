import { Request, Response } from "express";
import { Url } from "../models/Url";

export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;

    try {
        // Find the URL by slug
        const url = await Url.findOne({ slug });

        if (!url) {
            res.status(404).json({ error: "URL not found" });
            return;
        }

        // Return analytics data
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
