// userRoutes.ts
import express from "express";
import { toggleFavoriteAnime, getUserFavorites, getUserProfile, migrateGuestUser, getUserFavoritesIds} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/toggleFavorite", authMiddleware, toggleFavoriteAnime); 
router.get("/favorites", authMiddleware, getUserFavorites);
router.get("/favorites/ids", authMiddleware, getUserFavoritesIds);
router.get("/profile", authMiddleware, getUserProfile);
router.post("/migrate-guest", authMiddleware, migrateGuestUser);
export default router;
