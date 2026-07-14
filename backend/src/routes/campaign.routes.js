import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  getMyCampaigns,

  requestPayment,
  startPurchasing,
  readyForDelivery,
  completeCampaign,
  cancelUnpaidOrders,
  reopenCampaign,
  checkPurchasingController,
  getResidentCampaigns,
  updateCampaignController,
  deleteCampaignController,



} from "../controllers/campaign.controller.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("PURCHASE_MANAGER"),
  createCampaign
);
router.get(
  "/resident-campaigns",
  authMiddleware,
  roleMiddleware("RESIDENT"),
  getResidentCampaigns
);


router.patch(
  "/:campaignId",
  authMiddleware,
  roleMiddleware("PURCHASE_MANAGER"),
  updateCampaignController
);


router.delete(
  "/:campaignId",
  authMiddleware,
  roleMiddleware("PURCHASE_MANAGER"),
  deleteCampaignController
);



router.get("/", getAllCampaigns);
router.get(
  "/my-campaigns",
  authMiddleware,
  getMyCampaigns
);

router.get(
  "/:id",
  authMiddleware,
  getCampaignById
);

router.post(
  "/:campaignId/request-payment",
  authMiddleware,
  requestPayment
);


/*router.patch(
  "/:campaignId/payment-info",
  authMiddleware,
  roleMiddleware("PURCHASE_MANAGER"),
  updatePaymentInfo
);*/



router.post(
  "/:campaignId/check-purchasing",
  authMiddleware,
  checkPurchasingController
);

router.patch(
  "/:campaignId/start-purchasing",
  authMiddleware,
  roleMiddleware("PURCHASE_MANAGER"),
  startPurchasing
);

router.patch(
  "/:campaignId/ready-for-delivery",
  authMiddleware,
  roleMiddleware("PURCHASE_MANAGER"),
  readyForDelivery
);

router.patch(
  "/:campaignId/complete",
  authMiddleware,
  roleMiddleware("PURCHASE_MANAGER"),
  completeCampaign
);


router.patch(
  "/:campaignId/cancel-unpaid-orders",
  authMiddleware,
  roleMiddleware("PURCHASE_MANAGER"),
  cancelUnpaidOrders
);


router.patch(
  "/:campaignId/reopen",
  authMiddleware,
  roleMiddleware("PURCHASE_MANAGER"),
  reopenCampaign
);




export default router;