import express from "express";

import { authMiddleware }
from "../middlewares/auth.middleware.js";

import {
  getResidentDashboardController,
  getManagerDashboardController

} from "../controllers/dashboard.controller.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(

  "/",

  authMiddleware,

  getResidentDashboardController

);

router.get(

  "/manager",

  authMiddleware,

  roleMiddleware("PURCHASE_MANAGER"),

  getManagerDashboardController

);

export default router;