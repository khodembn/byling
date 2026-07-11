import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import campaignRoutes from "./routes/campaign.routes.js";
import productRoutes from "./routes/product.routes.js";
import campaignProductRoutes from "./routes/campaignProduct.routes.js";
import orderRoutes from "./routes/order.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import path from "path";
import paymentRoutes from "./routes/payment.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
}));


app.use(express.json());

// Test Route
app.get("/ping", (req, res) => {
  res.json({
    success: true,
    message: "Server is running"
  });
});


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/campaign", campaignRoutes);
app.use("/api/product", productRoutes);
app.use("/api/campaign-product", campaignProductRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/api/payment", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);


export default app;