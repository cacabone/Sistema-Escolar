import express from "express";
import { showLogin, loginUser, showRegister, registerUser, logoutUser } from "../controllers/authController.js";
const router = express.Router();

router.get("/login", showLogin);
router.post("/login", loginUser);
router.get("/register", showRegister);
router.post("/register", registerUser);
router.get("/logout", logoutUser);

export default router;
