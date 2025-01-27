import { Request, Response } from "express";
import { Url } from "../models/Url"; // MongoDB model for URLs
import redisClient from "../utils/redis"; // Redis client for caching
import { customAlphabet } from "nanoid"; // NanoID for generating unique slugs

const PORT = process.env.PORT || 5000;

// Generate a NanoID generator with a custom alphabet and length
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 8);

export const getUrls = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId; // Ensure userId is passed via authMiddleware
    const urls = await Url.find({ userId }); // Fetch URLs specific to the user
    res.status(200).json(urls);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch URLs" });
  }
};
/**
 * Create a shortened URL.
 * - Accepts original URL and optional custom slug.
 * - Stores the data in MongoDB.
 */
export const createShortUrl = async (req: Request, res: Response): Promise<void> => {
    const { originalUrl, slug, expirationDate } = req.body;
    const userId = req.body.userId; // Assuming authentication adds `userId` to the request

    try {
        // Use the provided slug or generate a new one
        const shortSlug = slug || nanoid();
        const shortUrl = `${req.protocol}://short.ly/${shortSlug}`;

        // Check if the slug already exists
        const existingUrl = await Url.findOne({ slug: shortSlug });
        if (existingUrl) {
            res.status(400).json({ error: "Slug already in use. Please choose another one." });
            return;
        }

        // Create and save the new URL in the database
        const newUrl = new Url({
            originalUrl,
            slug: shortSlug,
            shortUrl,
            expirationDate,
            userId,
        });
        await newUrl.save();

        res.status(201).json({ data: {
                type: "urls",
                id: newUrl._id,
                attributes: {
                    originalUrl: newUrl.originalUrl,
                    shortUrl: newUrl.shortUrl,
                    slug: newUrl.slug,
                    expirationDate: newUrl.expirationDate,
                },
            }, });
    } catch (err) {
        console.error("Error creating short URL:", err);
        res.status(500).json({ error: "Failed to create short URL" });
    }
};

/**
 * Redirect to the original URL based on the provided slug.
 * - Checks Redis cache for faster lookup.
 * - Falls back to MongoDB if not found in cache.
 */

export const redirectToOriginalUrl = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;

  try {
    // Find the URL by slug and increment the visit count
    const url = await Url.findOneAndUpdate(
      { slug },
      { $inc: { visitCount: 1 } },
      { new: true }
    );

    if (!url) {
      res.status(404).json({ error: "URL not found or expired" });
      return;
    }
    await redisClient.set(slug, url.originalUrl, {
    EX: 60 * 60, // Cache for 1 hour
});
    // Redirect to the original URL
    res.redirect(`http://localhost:${PORT}/urls`);
  } catch (err) {
    console.error("Error redirecting to original URL:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const updateSlug = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // URL ID to update
  const { newSlug } = req.body;

  try {
    // Check if the slug already exists
    const existingSlug = await Url.findOne({ slug: newSlug });
    if (existingSlug) {
      res.status(400).json({ error: "Slug already in use." });
      return; // Explicitly return after sending a response
    }

    // Find the URL by ID
    const url = await Url.findById(id);
    if (!url) {
      res.status(404).json({ error: "URL not found." });
      return; // Explicitly return after sending a response
    }

    // Update the slug and short URL
    url.slug = newSlug;
    url.shortUrl = `${req.protocol}://short.ly/${newSlug}`;
    await url.save();

    // Send the updated URL as a response
    res.status(200).json({
      id: url._id,
      slug: url.slug,
      shortUrl: url.shortUrl,
      originalUrl: url.originalUrl,
    });
  } catch (err) {
    console.error("Error updating slug:", err);
    res.status(500).json({ error: "Failed to update slug." });
  }
};

