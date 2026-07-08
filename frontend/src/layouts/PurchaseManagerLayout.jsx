import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import "../styles/navbar.css";
import "../styles/layout.css";
import "../styles/sidebar.css";


export default function PurchaseManagerLayout() {

    return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="dashboard-content">

        <Navbar />

        <main className="dashboard-main">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
