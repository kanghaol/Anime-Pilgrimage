// userRoutes.ts
import express from "express";
import { removeFavoriteAnime, addFavoriteAnime, getUserFavorites, getUserProfile, migrateGuestUser, getUserFavoritesIds} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();


router.delete("/favorites", authMiddleware, removeFavoriteAnime);
router.put("/favorites", authMiddleware, addFavoriteAnime);
router.get("/favorites", authMiddleware, getUserFavorites);
router.get("/favorites/ids", authMiddleware, getUserFavoritesIds);
router.get("/profile", authMiddleware, getUserProfile);
router.post("/migrate-guest", authMiddleware, migrateGuestUser);
export default router;
