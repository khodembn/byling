import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
} from "../controllers/product.controller.js";

const router = express.Router();


router.post(
  "/",
  authMiddleware,
  roleMiddleware("PURCHASE_MANAGER"),
  createProduct
);


router.get("/", authMiddleware, getAllProducts);


router.get("/:id", authMiddleware, getProductById);

export default router;