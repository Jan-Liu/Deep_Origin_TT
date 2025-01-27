import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * Mongoose schema for storing user data.
 * - `username`: Unique username for the user (required).
 * - `password`: Hashed password for authentication (required).
 * - `role`: Role of the user, either "user" or "admin" (default: "user").
 */
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
});

/**
 * Pre-save middleware to hash the user's password before saving it to the database.
 * - Only hashes the password if it has been modified.
 */
UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

export const User = mongoose.model("User", UserSchema);
