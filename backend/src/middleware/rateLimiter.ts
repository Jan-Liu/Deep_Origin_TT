import rateLimit from "express-rate-limit";

/**
 * Rate-limiting middleware to limit the number of requests a client can make.
 * - Limits to a maximum of 10 requests per minute.
 * - Sends a JSON response with an error message when the limit is exceeded.
 */
export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: {
    error: "Too many requests, please try again later.",
  },
});