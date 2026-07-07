import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
   createOrUpdateOrder,
   getMyOrder,
   submitOrder,
   getOrderPreview,
   cancelSubmittedOrderController
 }
  from "../controllers/order.controller.js";
const router = express.Router();


router.post(
  "/",
  authMiddleware,
  createOrUpdateOrder
);
router.get(
  "/my-order/:campaignId",
  authMiddleware,
  getMyOrder
);
router.post(
  "/:orderId/submit",
  authMiddleware,
  submitOrder
);

router.delete(
  "/:orderId/cancel",
  authMiddleware,
  cancelSubmittedOrderController
);

router.get(
  "/preview/:campaignId",
  authMiddleware,
  getOrderPreview
);



export default router;