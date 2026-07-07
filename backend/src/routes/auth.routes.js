import express from "express";
import {
  registerManager,
  registerUser,
  login,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register-manager", registerManager);
router.post("/register-user", registerUser);
router.post("/login", login);

export default router;