import express from "express";
import { getLocationsByAnimeId } from "../controllers/locationController";


const router = express.Router();

router.get("/:anime_id", getLocationsByAnimeId);

export default router;