import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
} from "../controllers/product.controller.js";

import productUpload from "../middlewares/productUpload.middleware.js";
const router = express.Router();


router.post(
  "/",
  authMiddleware,
  roleMiddleware("PURCHASE_MANAGER"),
  productUpload.single("image"),
  createProduct
);


router.get("/", authMiddleware, getAllProducts);


router.get("/:id", authMiddleware, getProductById);

export default router;