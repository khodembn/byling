import { Outlet } from "react-router-dom";


import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";


import LatestNotificationModal
  from "../components/modals/NotificationModal";


import useLatestNotification
  from "../hooks/useLatestNotification";

import "../styles/navbar.css";
import "../styles/layout.css";
import "../styles/sidebar.css";
import "../styles/notification.css";



export default function PurchaseManagerLayout() {


  const {
    latestNotification,
    closeNotification
  }
    =
    useLatestNotification();



  return (

    <div className="dashboard-layout">


      <Sidebar />


      <div className="dashboard-content">


        <Navbar />


        <main className="dashboard-main">

          <Outlet />

        </main>


      </div>



      <LatestNotificationModal

        notification={latestNotification}

        onClose={closeNotification}

      />


    </div>

  );

}