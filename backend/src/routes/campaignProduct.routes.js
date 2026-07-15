import express from "express";
import * as controller from "../controllers/campaignProduct.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";


const router = express.Router();


// اضافه کردن محصول به کمپین
router.post(
  "/:campaignId",
  authMiddleware,
  roleMiddleware("PURCHASE_MANAGER"),
  controller.addProductToCampaign
);


// دریافت محصولات یک کمپین
router.get(
  "/:campaignId",
  authMiddleware,
  controller.getCampaignProducts
);


// ویرایش محصول کمپین
router.patch(
  "/:campaignId/:campaignProductId",
  authMiddleware,
  roleMiddleware("PURCHASE_MANAGER"),
  controller.updateCampaignProduct
);


// حذف محصول کمپین
router.delete(
  "/:campaignId/:campaignProductId",
  authMiddleware,
  roleMiddleware("PURCHASE_MANAGER"),
  controller.deleteCampaignProduct
);


export default router;