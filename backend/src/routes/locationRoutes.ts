import express from "express";
import { getLocationsByAnimeId, getlocationsByLocationId } from "../controllers/locationController";


const router = express.Router();

router.get("/LocationsByAnime/:id", getLocationsByAnimeId);
router.get("/LocationById/:id", getlocationsByLocationId);

export default router;