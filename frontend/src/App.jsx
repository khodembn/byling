import { Routes, Route } from "react-router-dom";

import Home from "./pages/shared/home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import ResidentDashboard from "./pages/resident/Dashboard";
import PurchaseDashboard from "./pages/purchaseManager/Dashboard";
import Campaigns from "./pages/purchaseManager/Campaigns";
import CreateCampaign from "./pages/purchaseManager/CreateCampaign";
import CampaignDetails from "./pages/purchaseManager/CampaignDetails";
import CampaignView from "./pages/purchaseManager/CampaignView";
import Payments from "./pages/purchaseManager/Payments";
import PaymentDetails from "./pages/purchaseManager/PaymentDetails";
import ManagerOrders from "./pages/purchaseManager/ManagerOrders";
import ManagerOrderDetails from "./pages/purchaseManager/ManagerOrderDetails";
import CampaignManagement from "./pages/purchaseManager/CampaignManagement";
import ManagerProfile from "./pages/purchaseManager/ManagerProfile";
import Residents from "./pages/purchaseManager/Residents";
import ManagerNotifications from "./pages/purchaseManager/ManagerNotifications";

import ResidentLayout from "./layouts/ResidentLayout";
import PurchaseManagerLayout from "./layouts/PurchaseManagerLayout";
import ResidentCampaigns from "./pages/resident/Campaigns";
import ResidentCampaignView from "./pages/resident/ResidentCampaignView";
import ResidentCart from "./pages/resident/ResidentCart";
import ResidentOrders from "./pages/resident/ResidentOrders";
import PaymentPage from "./pages/resident/PaymentPage";
import ResidentPayments from "./pages/resident/ResidentPayments";
import ResidentNotifications from "./pages/resident/ResidentNotifications";
import ResidentProfile from "./pages/resident/ResidentProfile";

import PrivateRoute from "./routes/privateRoutes";
import RoleRoute from "./routes/RoleRoute";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* Resident */}

      <Route
        element={
          <PrivateRoute>
            <RoleRoute allowedRole="RESIDENT">
              <ResidentLayout />
            </RoleRoute>
          </PrivateRoute>
        }
      >
        <Route
          path="/resident/dashboard"
          element={<ResidentDashboard />}
        />

        <Route
          path="/resident/campaigns"
          element={<ResidentCampaigns />}
        />

        <Route
          path="/resident/campaign/:id"
          element={<ResidentCampaignView />}
        />

        <Route

          path="/resident/cart/:campaignId"

          element={<ResidentCart />}

        />

        <Route
          path="/resident/cart"
          element={<ResidentCart />}
        />

        <Route
          path="/resident/orders"
          element={<ResidentOrders />}
        />


        <Route

          path="/resident/payment/:orderId"

          element={<PaymentPage />}

        />

        <Route
          path="/resident/payments"
          element={<ResidentPayments />}
        />

        <Route
          path="/resident/notifications"
          element={<ResidentNotifications />}
        />

        <Route
          path="/resident/profile"
          element={<ResidentProfile />}
        />

      </Route>

      {/* Purchase Manager */}

      <Route
        element={
          <PrivateRoute>
            <RoleRoute allowedRole="PURCHASE_MANAGER">
              <PurchaseManagerLayout />
            </RoleRoute>
          </PrivateRoute>
        }
      >
        <Route
          path="/purchase/dashboard"
          element={<PurchaseDashboard />}
        />


        <Route
          path="/purchase/campaigns"
          element={<Campaigns />}
        />

        <Route
          path="/purchase/campaign/create"
          element={<CreateCampaign />}
        />

        <Route
          path="/purchase/campaign/:id"
          element={<CampaignDetails />}
        />
        <Route

          path="/purchase/campaign/:id/view"

          element={<CampaignView />}

        />
        <Route

          path="/purchase/payments"

          element={<Payments />}

        />

        <Route

          path="/purchase/payments/:paymentId"

          element={<PaymentDetails />}

        />

        <Route

          path="/purchase/orders"

          element={<ManagerOrders />}

        />

        <Route
          path="/purchase/order/:orderId"
          element={<ManagerOrderDetails />}
        />


        <Route
          path="/purchase/campaign/:id/manage"
          element={<CampaignManagement />}
        />



        <Route
          path="/purchase/profile"
          element={<ManagerProfile />}
        />
        <Route
          path="/purchase/notifications"
          element={
            <ManagerNotifications />
          }
        />
        <Route
          path="/purchase/residents"
          element={<Residents />}
        />
      </Route>



    </Routes>
  );
}

export default App;