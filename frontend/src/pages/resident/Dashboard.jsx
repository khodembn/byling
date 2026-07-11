import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getResidentDashboard } from "../../api/residentApi";

import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardSection from "../../components/dashboard/DashboardSection";

export default function ResidentDashboard() {

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function fetchDashboard() {

      try {

        const data =
          await getResidentDashboard();

        setDashboard(data);

      }

      catch (error) {

        console.error(error);

      }

      finally {

        setLoading(false);

      }

    }

    fetchDashboard();

  }, []);

  if (loading)
    return <h2>در حال بارگذاری...</h2>;

  if (!dashboard)
    return <h2>خطا در دریافت اطلاعات</h2>;

  return (
    <>

      <h1>

        سلام {dashboard.profile.fullName}

      </h1>

      <p>

        ساختمان {dashboard.profile.buildingName}

      </p>

      <p>

        طبقه {dashboard.profile.floorNumber}
        {" - "}
        واحد {dashboard.profile.unitNumber}

      </p>

      <DashboardSection title="وضعیت سفارش‌های من">

        <div className="cards-grid">

          <DashboardCard
            title="سبد خرید"
            value={dashboard.orders.cart}
          />

          <DashboardCard
            title="ثبت شده"
            value={dashboard.orders.submitted}
          />

          <DashboardCard
            title="پرداخت شده"
            value={dashboard.orders.paid}
          />

          <DashboardCard
            title="آماده تحویل"
            value={dashboard.orders.ready}
          />

          <DashboardCard
            title="تحویل شده"
            value={dashboard.orders.delivered}
          />

        </div>

      </DashboardSection>

      <DashboardSection title="کمپین فعال">

        {

          dashboard.activeCampaign ?

            <>

              <h4>

                {dashboard.activeCampaign.title}

              </h4>

              <p>

                وضعیت :

                {dashboard.activeCampaign.status}

              </p>

              <p>

                مهلت پرداخت :

                {

                  new Date(

                    dashboard.activeCampaign.paymentDeadline

                  ).toLocaleDateString("fa-IR")

                }

              </p>

              <Link

                className="action-btn view-btn"

                to={`/resident/campaign/${dashboard.activeCampaign.campaignId}`}

              >

                مشاهده محصولات کمپین

              </Link>

            </>

            :

            <p>

              کمپین فعالی وجود ندارد.

            </p>

        }

      </DashboardSection>

      <DashboardSection title="فاکتور در انتظار پرداخت">

        {

          dashboard.pendingInvoice ?

            <>

              <p>

                مبلغ :

                {dashboard.pendingInvoice.amount}

              </p>

              <p>

                مهلت :

                {dashboard.pendingInvoice.deadline}

              </p>

            </>

            :

            <p>

              فاکتور معلقی وجود ندارد.

            </p>

        }

      </DashboardSection>

      <DashboardSection title="اعلان‌ها">

        {

          dashboard.notifications.map(item => (

            <div key={item.notificationId}>

              <h4>

                {item.title}

              </h4>

              <p>

                {item.message}

              </p>

              <small>

                {

                  new Date(

                    item.createdAt

                  ).toLocaleString("fa-IR")

                }

              </small>

              <hr />

            </div>

          ))

        }

      </DashboardSection>

    </>

  );

}