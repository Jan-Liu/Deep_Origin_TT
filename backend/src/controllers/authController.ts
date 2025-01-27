import { Request, Response } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

/**
 * Handle user signup by creating a new user in the database.
 * @param req - Express request object, expecting `username` and `password` in the body.
 * @param res - Express response object.
 */
export const signup = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    console.log(username);
    try {
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: "User created successfully!" });
    } catch (err) {

        res.status(400).json({ error: "Already registered!" });
    }
};

/**
 * Handle user login by validating credentials and returning a JWT token.
 * @param req - Express request object, expecting `username` and `password` in the body.
 * @param res - Express response object.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
