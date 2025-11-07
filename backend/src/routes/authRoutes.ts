import express from "express";
import { registerUser, loginUser, verifyToken, logoutUser } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify", verifyToken);
router.post("/logout", logoutUser);


router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "You are authenticated!", user: (req as any).user });
});

export default router;
