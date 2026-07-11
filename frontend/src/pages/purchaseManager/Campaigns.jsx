import { useEffect, useState } from "react";
import { getCampaigns } from "../../api/campaignApi";
import { Link } from "react-router-dom";
import "../../styles/campaigns.css";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await getCampaigns();
        setCampaigns(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return <h2>در حال بارگذاری...</h2>;
  }

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchSearch = campaign.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "ALL"
        ? true
        : campaign.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const getStatusLabel = (status) => {
    switch (status) {
      case "DRAFT":
        return "پیش‌نویس";

      case "ACTIVE":
        return "فعال";

      case "AWAITING_PAYMENT":
        return "در انتظار پرداخت";

      case "PURCHASING":
        return "در حال خرید";

      case "READY_FOR_DELIVERY":
        return "آماده تحویل";

      case "COMPLETED":
        return "تکمیل شده";

      case "CANCELLED":
        return "لغو شده";

      default:
        return status;
    }
  };



  return (
    <>
      <div className="campaign-header">
        <h1>کمپین‌های من</h1>

        <Link
          to="/purchase/campaign/create"
          className="create-btn"
        >
          + ایجاد کمپین
        </Link>
      </div>

      <div className="campaign-summary">
        <div className="summary-card">
          <h4>تعداد کل کمپین‌ها</h4>

          <h2>{campaigns.length}</h2>
        </div>
      </div>

      <div className="campaign-filters">
        <input
          type="text"
          placeholder="جستجوی عنوان کمپین..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">همه وضعیت‌ها</option>

          <option value="DRAFT">پیش‌نویس</option>

          <option value="ACTIVE">فعال</option>

          <option value="AWAITING_PAYMENT">
            در انتظار پرداخت
          </option>

          <option value="PURCHASING">
            در حال خرید
          </option>

          <option value="READY_FOR_DELIVERY">
            آماده تحویل
          </option>

          <option value="COMPLETED">
            تکمیل شده
          </option>

          <option value="CANCELLED">
            لغو شده
          </option>
        </select>
      </div>

      <div className="table-card">
        <table className="campaign-table">
          <thead>
            <tr>
              <th>عنوان</th>

              <th>وضعیت</th>

              <th>ساختمان</th>

              <th className="date-col">
                مهلت پرداخت
              </th>

              <th className="date-col">
                تاریخ ایجاد
              </th>
              <th>عملیات</th>

            </tr>

          </thead>

          <tbody>
            {filteredCampaigns.map((campaign) => (
              <tr key={campaign.campaignId}>
                <td>{campaign.title}</td>

                <td>
                  <div className="status-cell">
                    <span
                      className={`status-dot ${campaign.status}`}
                    ></span>

                    <span>
                      {getStatusLabel(campaign.status)}
                    </span>
                  </div>
                </td>

                <td>
                  {campaign.building.buildingName}
                </td>

                <td className="date-col">
                  {new Date(
                    campaign.paymentDeadline
                  ).toLocaleDateString("fa-IR")}
                </td>

                <td className="date-col">
                  {new Date(
                    campaign.createdAt
                  ).toLocaleDateString("fa-IR")}
                </td>




                <td>
                  <Link
                    to={`/purchase/campaign/${campaign.campaignId}/view`}
                    className="action-btn view-btn"
                  >
                    مشاهده
                  </Link>

                  <Link
                    to={`/purchase/campaign/${campaign.campaignId}`}
                    className="action-btn edit-btn"
                  >
                    ویرایش
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}