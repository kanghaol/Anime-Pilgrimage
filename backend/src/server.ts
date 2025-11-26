import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import animeRoutes from "./routes/animeRoutes";
import locationRoutes from "./routes/locationRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (_, res) => res.send("Anime Pilgrimage API is running "));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/anime", animeRoutes);
app.use("/api/locations", locationRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
