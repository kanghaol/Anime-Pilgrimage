import express from "express";
import { getAnimeList, getAnime } from "../controllers/animeController";


const router = express.Router();

router.get("/AnimeList", getAnimeList);
router.get("/AnimeByID/:id", getAnime);
export default router;
