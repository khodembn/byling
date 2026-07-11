import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getResidentCampaigns } from "../../api/residentApi";

export default function ResidentCampaigns() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const data = await getResidentCampaigns();
                setCampaigns(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    if (loading) return <h2>در حال بارگذاری...</h2>;

    return (
        <div>

            <h1>کمپین‌های ساختمان</h1>

            {campaigns.map((campaign) => (

                <div
                    key={campaign.campaignId}
                    className="resident-campaign-card"
                >

                    <h2>{campaign.title}</h2>

                    <p>
                        وضعیت:
                        {" "}
                        {campaign.status}
                    </p>

                    <p>
                        مدیر خرید:
                        {" "}
                        {campaign.manager.fullName}
                    </p>

                    <p>
                        مهلت پرداخت:
                        {" "}
                        {new Date(
                            campaign.paymentDeadline
                        ).toLocaleDateString("fa-IR")}
                    </p>

                    <Link
                        className="action-btn view-btn"
                        to={`/resident/campaign/${campaign.campaignId}`}
                    >
                        مشاهده محصولات
                    </Link>

                </div>

            ))}

        </div>
    );
}