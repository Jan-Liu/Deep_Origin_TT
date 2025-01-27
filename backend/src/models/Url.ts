import mongoose from "mongoose";

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
