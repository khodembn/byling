import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import * as paymentController from "../controllers/payment.controller.js";
import {getPaymentPreview,
        approvePayment,
        rejectPayment
} from "../controllers/payment.controller.js";



const router = express.Router();

router.post(
  "/upload-receipt/:campaignId",
  authMiddleware,
  upload.single("receiptImage"),
  paymentController.uploadReceipt
);

router.get(
  "/preview/:campaignId",
  authMiddleware,
  roleMiddleware("RESIDENT"),
  getPaymentPreview
);

router.get(

"/pending",
authMiddleware,
roleMiddleware("PURCHASE_MANAGER"),
paymentController.getPendingPayments

);

router.patch(
  "/:paymentId/approve",
  authMiddleware,
  roleMiddleware("PURCHASE_MANAGER"),
  approvePayment
);

router.patch(

  "/:paymentId/reject",

  authMiddleware,

  roleMiddleware("PURCHASE_MANAGER"),

  rejectPayment

);
export default router;