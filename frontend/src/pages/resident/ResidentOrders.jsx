import { useEffect, useState } from "react";
import {
    getMyOrders,
    cancelOrder
} from "../../api/orderApi";

import "../../styles/ResidentOrders.css";
import PreviewModal from "../../components/modals/PreviewModal";
import { useNavigate } from "react-router-dom";

export default function ResidentOrders() {


    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [selectedPreview, setSelectedPreview] = useState(null);

    const [selectedCampaign, setSelectedCampaign] = useState("");



    const fetchOrders = async () => {

        try {

            const data = await getMyOrders();

            setOrders(data);


        }
        catch (err) {

            console.log(err);

        }
        finally {

            setLoading(false);

        }

    };



    useEffect(() => {

        fetchOrders();

    }, []);




    const handleCancel = async (orderId) => {


        if (!window.confirm("آیا از لغو سفارش مطمئن هستید؟"))
            return;


        await cancelOrder(orderId);


        fetchOrders();


    };





    const statusText = {

        SUBMITTED: "ثبت شده",

        PAID: "پرداخت شده",

        INITIAL_INVOICED: "منتظر پرداخت",

        FINAL_INVOICED: "فاکتور نهایی",

        READY_FOR_DELIVERY: "آماده تحویل",

        DELIVERED: "تحویل داده شده"

    };



    if (loading)

        return <div>در حال دریافت سفارش‌ها...</div>




    return (

        <div className="orders-page">


            <h1>
                سفارش‌های من
            </h1>



            {
                orders.map(order => (


                    <div
                        className="order-card"
                        key={order.orderId}
                    >



                        <div className="order-header">


                            <h2>
                                {order.campaignTitle}
                            </h2>


                            <span>
                                {statusText[order.status] || order.status}
                            </span>


                        </div>




                        <div className="products">


                            {
                                order.preview.items.map(item => (


                                    <div
                                        className="order-product"
                                        key={item.campaignProductId}
                                    >


                                        {
                                            item.imageUrl &&

                                            <img
                                                src={`http://localhost:5000${item.imageUrl}`}
                                            />

                                        }



                                        <div>

                                            <h4>
                                                {item.productName}
                                            </h4>


                                            <p>
                                                تعداد:
                                                {item.quantity}
                                            </p>


                                        </div>


                                    </div>


                                ))

                            }


                        </div>





                        <div className="price-box">


                            <p>

                                صرفه‌جویی:

                                <b>
                                    {order.preview.totalSaving.toLocaleString()}
                                </b>

                                تومان

                            </p>



                            <h3>

                                مبلغ قابل پرداخت:

                                {order.preview.payableAmount.toLocaleString()}

                                تومان

                            </h3>


                        </div>





                        <div className="actions">

                            {order.campaignStatus !== "AWAITING_PAYMENT" &&

                                <button

                                    onClick={() => {

                                        setSelectedPreview(order.preview);

                                        setSelectedCampaign(order.campaignTitle);

                                    }}

                                >

                                    مشاهده پیش‌فاکتور

                                </button>

                            }

                            {order.campaignStatus === "AWAITING_PAYMENT" &&

                                <button

                                    onClick={() => {

                                        setSelectedPreview(order.preview);

                                        setSelectedCampaign(order.campaignTitle);

                                    }}

                                >

                                    مشاهده فاکتور اولیه

                                </button>

                            }



                            {
                                order.status === "SUBMITTED" &&
                                !order.paymentStatus &&
                                order.campaignStatus === "ACTIVE" &&

                                <button

                                    className="cancel"

                                    onClick={() => handleCancel(order.orderId)}

                                >

                                    لغو سفارش

                                </button>
                            }





                            {
                                order.campaignStatus === "AWAITING_PAYMENT" &&
                                (
                                    !order.paymentStatus ||
                                    order.paymentStatus === "REJECTED"
                                )
                                &&
                                <button
                                    className="pay"
                                    onClick={() =>
                                        navigate(`/resident/payment/${order.orderId}`)
                                    }
                                >
                                    پرداخت
                                </button>
                            }



                        </div>



                    </div>


                ))

            }






            {
                selectedPreview &&

                <PreviewModal

                    preview={selectedPreview}

                    campaignTitle={selectedCampaign}

                    onClose={() => setSelectedPreview(null)}

                />

            }



        </div>

    )

}