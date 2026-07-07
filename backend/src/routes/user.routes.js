import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { 
  transferManagerController,
  getResidentsController,
  deleteAccountController
 }
  from "../controllers/user.controller.js";


const router = express.Router();



router.get(
  "/manager-test",
  authMiddleware,
  roleMiddleware("PURCHASE_MANAGER"),
  (req, res) => {
    res.json({
      success: true,
      message: "فقط مسئول خرید این را می‌بیند",
    });
  }
);


router.post(

"/transfer-manager",
authMiddleware,
transferManagerController

);

router.get(
  "/residents",
  authMiddleware,
  getResidentsController
);

router.delete(

"/me",

authMiddleware,

deleteAccountController

);

export default router;