import express from "express";
import { registerUser, loginUser, verifyToken, logoutUser } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";
import rateLimiter from "express-rate-limit";

const limiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max:7, // limit 5 per window
})
const router = express.Router();

router.post("/register", limiter, registerUser);
router.post("/login", limiter, loginUser);
router.get("/verify", authMiddleware, verifyToken);
router.post("/logout", authMiddleware, logoutUser);


export default router;
