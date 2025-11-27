import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { User } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

//  REGISTER
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hash = await bcrypt.hash(password, 10);
    const normalizedEmail = email.trim().toLowerCase();
    const newUser = await User.create({
      uuId: uuidv4(),
      email: normalizedEmail,
      name: name,
      passwordHash: hash,
    });

    const token = jwt.sign(
      { uuId: newUser.uuId, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: { uuId: newUser.uuId, normalizedEmail, name },
    });
  } catch (err) {
    res.status(500).json({ message: "Error registering user" });
  }
};

//  LOGIN
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { uuId: user.uuId, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    user.lastLogin = new Date();
    await user.save();

    res.json({ token, user: { uuId: user.uuId, email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ message: "Error logging in" });
  }
};

//  VERIFY TOKEN
export const verifyToken = async (req: Request, res: Response) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ message: "Missing token" });
    }
    const token = header.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, decoded });
  } catch (err) {
    res.status(403).json({ valid: false, message: "Invalid or expired token" });
  }
};

//  LOGOUT (Stateless Example) //do a refresh token later 
export const logoutUser = async (_req: Request, res: Response) => {
 
  res.json({ message: "Logged out successfully (client should delete token)" });
};
