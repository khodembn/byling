import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getCampaign,
} from "../../api/campaignApi";

import {
    getCampaignProducts,
} from "../../api/campaignProductApi";

import "../../styles/CampaignView.css";

export default function CampaignView() {

    const { id } = useParams();

    const [campaign, setCampaign] = useState(null);

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true)

    const navigate = useNavigate();

    useEffect(() => {

        const fetchData = async () => {

            try {

                const campaignData = await getCampaign(id);

                const productData =
                    await getCampaignProducts(id);

                setCampaign(campaignData);

                setProducts(productData);

            } catch (err) {

                console.log(err);

            } finally {

                setLoading(false);

            }

        };

        fetchData();

    }, [id]);

    if (loading)
        return <h2>در حال بارگذاری...</h2>;

    return (

        <div>

            <h1>{campaign.title}</h1>
            <button

                className="back-btn"

                onClick={() =>
                    navigate("/purchase/campaigns")
                }

            >

                بازگشت

            </button>
            <p>

                وضعیت:

                {campaign.status}

            </p>

            <p>

                مهلت پرداخت:

                {

                    new Date(

                        campaign.paymentDeadline

                    ).toLocaleDateString("fa-IR")

                }

            </p>

            <hr />

            <h2>

                محصولات کمپین

            </h2>

            {

                products.map((product) => (

                    <div

                        key={product.campaignProductId}

                    >

                        <h3>

                            {product.productName}

                        </h3>

                        <p>

                            قیمت بازار:

                            {product.marketPrice}

                        </p>

                        <p>

                            قیمت کمپین:

                            {product.bulkPrice}

                        </p>
                        <p>

                            هزینه ارسال:

                            {product.shippingCost}

                        </p>

                        <p>

                            صرفه‌جویی:

                            {product.savingPercent}%

                        </p>

                        <p>

                            حد نصاب:

                            {product.thresholdQuantity}

                        </p>

                        <p>

                            سفارش فعلی:

                            {product.currentQuantity}

                        </p>

                        <hr />

                    </div>

                ))

            }

        </div>

    );

}