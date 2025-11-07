// userRoutes.ts
import express from "express";
import { toggleFavoriteAnime, getUserFavorites, getUserProfile} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/favorite/:anime_id", authMiddleware, toggleFavoriteAnime); 
router.get("/favorites", authMiddleware, getUserFavorites);
router.get("/profile", authMiddleware, getUserProfile);

export default router;
