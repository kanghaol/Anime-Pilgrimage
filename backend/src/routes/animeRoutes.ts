import express from "express";
import { getAnimeList } from "../controllers/animeController";


const router = express.Router();

router.get("/AnimeList", getAnimeList);


export default router;
