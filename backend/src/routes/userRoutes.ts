// userRoutes.ts
import express from "express";
import { removeFavoriteAnime, addFavoriteAnime, getUserFavoritesAnimeObjects, getUserProfile, migrateGuestUser, getUserFavoritesIds, getTheme, setTheme} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();


router.delete("/favorites-id", authMiddleware, removeFavoriteAnime);
router.put("/favorites-id", authMiddleware, addFavoriteAnime);
router.get("/favorites-anime-objects", authMiddleware, getUserFavoritesAnimeObjects);
router.get("/favorites/GetIds", authMiddleware, getUserFavoritesIds);
router.get("/profile", authMiddleware, getUserProfile);
router.post("/migrate-guest", authMiddleware, migrateGuestUser);
router.get("/getTheme", authMiddleware, getTheme);
router.put("/setTheme", authMiddleware, setTheme);
export default router;
