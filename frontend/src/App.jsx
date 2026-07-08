import { Routes, Route } from "react-router-dom";

import Home from "./pages/shared/home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import ResidentDashboard from "./pages/resident/Dashboard";
import PurchaseDashboard from "./pages/purchaseManager/Dashboard";

import ResidentLayout from "./layouts/ResidentLayout";
import PurchaseManagerLayout from "./layouts/PurchaseManagerLayout";

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
      </Route>

    </Routes>
  );
}

export default App;