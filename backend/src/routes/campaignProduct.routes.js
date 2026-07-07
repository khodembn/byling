import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import {
   addProductToCampaign,
  
 } from "../controllers/campaignProduct.controller.js";

//import { updateShippingCost } from "../controllers/campaignProduct.controller.js";

const router = express.Router();

router.post(
  "/:campaignId",
  authMiddleware,
  roleMiddleware("PURCHASE_MANAGER"),
  addProductToCampaign
);
/*router.patch(
  "/:id/shipping",
 authMiddleware,
  roleMiddleware("PURCHASE_MANAGER"),
  updateShippingCost
);*/

export default router;