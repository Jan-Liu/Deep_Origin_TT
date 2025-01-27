import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose, { ConnectOptions } from "mongoose";
import authRoutes from "./routes/auth";
import urlRoutes from "./routes/url";
import analyticsRoutes from "./routes/analytics";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/urls", urlRoutes);
app.use("/analytics", analyticsRoutes);

// Error Handling Middleware
app.use(errorHandler);

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/urlShortener";

const options: ConnectOptions = {
    dbName: "urlShortener",
};

mongoose.connect(MONGO_URI, options).then(() => {
    console.log("MongoDB connected successfully");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

export default app;
