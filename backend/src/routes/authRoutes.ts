import express from "express";
import { registerUser, loginUser, verifyToken, logoutUser } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify", authMiddleware, verifyToken);
router.post("/logout", authMiddleware, logoutUser);


export default router;
