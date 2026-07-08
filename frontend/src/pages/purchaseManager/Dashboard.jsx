
import { getPurchaseDashboard } from "../../api/purchaseManagerApi";

import { useEffect, useState } from "react";

import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardSection from "../../components/dashboard/DashboardSection";



export default function PurchaseManagerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);



useEffect(() => {
  async function fetchDashboard() {
    try {
      const data = await getPurchaseDashboard();
      setDashboard(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  fetchDashboard();
}, []);

  if (loading) {
    return <h2>در حال بارگذاری...</h2>;
  }

  if (!dashboard) {
    return <h2>خطا در دریافت اطلاعات</h2>;
  }

  return (
    <>
      <h1>سلام {dashboard.profile.fullName}</h1>

      <p>ساختمان {dashboard.profile.buildingName}</p>

      {/* وضعیت ساختمان */}
      <DashboardSection title="وضعیت ساختمان">
        <div className="cards-grid">
          <DashboardCard
            title="ساکنین فعال"
            value={dashboard.buildingStatus.activeResidents}
             icon="👥"
             color="#78C26D"
          />

          <DashboardCard
            title="کمپین فعال"
            value={dashboard.buildingStatus.activeCampaigns}
            icon="📦"
            color="#FFD54F"
          />

          <DashboardCard
            title="کمپین پایان یافته"
            value={dashboard.buildingStatus.completedCampaigns}
          />

          <DashboardCard
            title="در انتظار پرداخت"
            value={dashboard.buildingStatus.waitingPayments}
          />

          <DashboardCard
            title="در حال خرید"
            value={dashboard.buildingStatus.purchasingCampaigns}
          />

          <DashboardCard
            title="آماده تحویل"
            value={dashboard.buildingStatus.readyDeliveries}
          />
        </div>
      </DashboardSection>

      {/* آمار */}
      <DashboardSection title="آمار">
        <div className="cards-grid">
          <DashboardCard
            title="تعداد ساکنین"
            value={dashboard.statistics.residentCount}
          />

          <DashboardCard
            title="تعداد کمپین"
            value={dashboard.statistics.campaignCount}
          />

          <DashboardCard
            title="کل سفارش‌ها"
            value={dashboard.statistics.totalOrders}
          />
        </div>
      </DashboardSection>

      <DashboardSection title="عملیات سریع">

  <div className="quick-actions">

    {dashboard.quickActions.createCampaign && (
      <button>
        ایجاد کمپین جدید
      </button>
    )}

    {dashboard.quickActions.checkPayments && (
      <button>
        بررسی پرداخت‌ها
      </button>
    )}

    {dashboard.quickActions.startPurchasing && (
      <button>
        شروع خرید عمده
      </button>
    )}

    {dashboard.quickActions.readyForDelivery && (
      <button>
        آماده‌سازی تحویل
      </button>
    )}

    {dashboard.quickActions.deliverOrders && (
      <button>
        ثبت تحویل سفارش‌ها
      </button>
    )}

  </div>

</DashboardSection>

      {/* اقدامات */}
      <DashboardSection title="اقدامات">
        <ul>
          <li>
            پرداخت‌های معلق: {dashboard.pendingActions.pendingPayments}
          </li>

          <li>
            آماده تحویل: {dashboard.pendingActions.readyForDelivery}
          </li>

          <li>
            نیاز به شروع خرید:{" "}
            {dashboard.pendingActions.needStartPurchasing ? "بله" : "خیر"}
          </li>

          <li>
            نیاز به بررسی:{" "}
            {dashboard.pendingActions.needAttention ? "بله" : "خیر"}
          </li>
        </ul>
      </DashboardSection>

      {/* کمپین فعال */}
      <DashboardSection title="کمپین فعال">
        <h4>{dashboard.activeCampaign.title}</h4>

        <p>{dashboard.activeCampaign.status}</p>

        <p>
          مهلت پرداخت:{" "}
          {new Date(
            dashboard.activeCampaign.paymentDeadline
          ).toLocaleDateString("fa-IR")}
        </p>
      </DashboardSection>

      {/* آخرین سفارش‌ها */}
      <DashboardSection title="آخرین سفارش‌ها">
        <table>
          <thead>
            <tr>
              <th>نام</th>
              <th>کمپین</th>
              <th>وضعیت</th>
            </tr>
          </thead>

          <tbody>
            {dashboard.latestOrders.map((order, index) => (
            <tr key={`${order.userId}-${order.campaignTitle}-${index}`}>
                <td>{order.fullName}</td>
                <td>{order.campaignTitle}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DashboardSection>

      {/* آخرین پرداخت‌ها */}
      <DashboardSection title="آخرین پرداخت‌ها">
        <table>
          <thead>
            <tr>
              <th>نام</th>
              <th>کمپین</th>
              <th>مبلغ</th>
              <th>وضعیت</th>
            </tr>
          </thead>

          <tbody>
            {dashboard.latestPayments.map((payment, index) => (
            <tr key={`${payment.userId}-${payment.campaignTitle}-${index}`}>
                <td>{payment.fullName}</td>
                <td>{payment.campaignTitle}</td>
                <td>{payment.amount}</td>
                <td>{payment.paymentStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DashboardSection>

      {/* اعلان‌ها */}
      <DashboardSection title="اعلان‌ها">
        {dashboard.notifications.map((item) => (
          <div key={item.notificationId}>
            <h4>{item.title}</h4>
            <p>{item.message}</p>
            <hr />
          </div>
        ))}
      </DashboardSection>
    </>
  );
}