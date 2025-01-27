import mongoose from "mongoose";

/**
 * Mongoose schema for storing URL data.
 * - `originalUrl`: The original long URL provided by the user (required).
 * - `slug`: Unique identifier for the shortened URL (required, unique).
 * - `shortUrl`: The generated short URL (required).
 * - `userId`: Reference to the user who created the URL (optional).
 * - `visitCount`: Tracks the number of visits to the shortened URL (default: 0).
 * - `expirationDate`: Optional expiration date for the shortened URL.
 * - `visitors`: Array of visitor information including IP, user agent, and timestamp.
 */
const UrlSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortUrl: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    visitCount: { type: Number, default: 0 },
    expirationDate: { type: Date },
    visitors: [
        {
            ip: String,
            userAgent: String,
            timestamp: Date,
        },
    ],
});

export const Url = mongoose.model("Url", UrlSchema);
