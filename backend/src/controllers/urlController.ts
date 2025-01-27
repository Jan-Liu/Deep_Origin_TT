import { Request, Response } from "express";
import { Url } from "../models/Url"; 
import redisClient from "../utils/redis"; 
import { customAlphabet } from "nanoid"; 

const PORT = process.env.PORT || 5000;

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 8);

/**
 * Fetch all URLs for a specific user.
 * @param req - Express request object, expecting `userId` in the body.
 * @param res - Express response object.
 */
export const getUrls = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const urls = await Url.find({ userId });
    res.status(200).json(urls);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch URLs" });
  }
};

/**
 * Create a shortened URL.
 * @param req - Express request object, expecting `originalUrl`, `slug`, `expirationDate`, and `userId` in the body.
 * @param res - Express response object.
 */
export const createShortUrl = async (req: Request, res: Response): Promise<void> => {
    const { originalUrl, slug, expirationDate } = req.body;
    const userId = req.body.userId;

    try {
        const shortSlug = slug || nanoid();
        const shortUrl = `${req.protocol}://short.ly/${shortSlug}`;

        const existingUrl = await Url.findOne({ slug: shortSlug });
        if (existingUrl) {
            res.status(400).json({ error: "Slug already in use. Please choose another one." });
            return;
        }

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
 * @param req - Express request object, expecting `slug` as a route parameter.
 * @param res - Express response object.
 */
export const redirectToOriginalUrl = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;

  try {
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
    EX: 60 * 60,
    });
    res.redirect(`http://localhost:${PORT}/urls`);
  } catch (err) {
    console.error("Error redirecting to original URL:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Update the slug of an existing URL.
 * @param req - Express request object, expecting `id` as a route parameter and `newSlug` in the body.
 * @param res - Express response object.
 */
export const updateSlug = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { newSlug } = req.body;
  try {
    const existingSlug = await Url.findOne({ slug: newSlug });
    if (existingSlug) {
      res.status(400).json({ error: "Slug already in use." });
      return;
    }
    const url = await Url.findById(id);
    if (!url) {
      res.status(404).json({ error: "URL not found." });
      return;
    }
    url.slug = newSlug;
    url.shortUrl = `${req.protocol}://short.ly/${newSlug}`;
    await url.save();

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
