import express from "express";

import {
  getMyNotifications,
  markNotificationAsRead,
} from "../controllers/notification.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/my",
  authMiddleware,
  getMyNotifications
);

router.patch(
  "/:notificationId/read",
  authMiddleware,
  markNotificationAsRead
);

export default router;