import express from "express";
import { getAnimeList, getAnime, searchAnime } from "../controllers/animeController";


const router = express.Router();

router.get("/AnimeList", getAnimeList);
router.get("/AnimeByID/:id", getAnime);
router.get("/search", searchAnime);
export default router;
