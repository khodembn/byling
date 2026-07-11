import { Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CampaignDetails from "../pages/CampainaDetails"
import CreateCampaign from "../pages/purchaseManager/CreateCampaign";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
  path="/purchase/campaign/create"
  element={<CreateCampaign />}
/>
      <Route
  path="/purchase/campaign/:Id"
  element={<CampaignDetails />}
/>
    </Routes>
  );
}