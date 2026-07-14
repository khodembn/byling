import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import {
  createOrUpdateOrder,
  getMyOrder,
  submitOrder,
  getOrderPreview,
  cancelSubmittedOrderController,
  getCart,
  getMyOrdersController,
  getManagerOrders,
  getManagerOrderDetails
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
router.get(

  "/manager",

  authMiddleware,

  roleMiddleware("PURCHASE_MANAGER"),

  getManagerOrders

);

router.get(

  "/manager/:orderId",

  authMiddleware,

  roleMiddleware("PURCHASE_MANAGER"),

  getManagerOrderDetails

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