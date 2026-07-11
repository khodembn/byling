import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createOrUpdateOrder,
  getMyOrder,
  submitOrder,
  getOrderPreview,
  cancelSubmittedOrderController,
  getCart,
  getMyOrdersController
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

router.get(
  "/my-orders",
  authMiddleware,
  getMyOrdersController
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

router.get(
  "/cart",
  authMiddleware,
  getCart
);

export default router;