import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getManagerOrderDetails,
} from "../../api/orderApi";

import "../../styles/ManagerOrderDetails.css";

const orderStatusMap = {
    SUBMITTED: "ثبت شده",
    PAID: "پرداخت شده",
    DELIVERED: "تحویل شده",
    CANCELLED: "لغو شده",
};

const paymentStatusMap = {
    PENDING: "در حال بررسی",
    APPROVED: "تایید شده",
    REJECTED: "رد شده",
};

export default function ManagerOrderDetails() {

    const { orderId } = useParams();

    const [order, setOrder] = useState(null);

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    useEffect(() => {

        fetchOrder();

    }, []);

    const fetchOrder = async () => {

        try {

            const data =
                await getManagerOrderDetails(orderId);

            setOrder(data);

        }

        catch (err) {

            console.error(err);

            alert("خطا در دریافت اطلاعات سفارش");

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return <h2>در حال دریافت اطلاعات...</h2>;

    }

    if (!order) {

        return <h2>سفارش پیدا نشد.</h2>;

    }

    return (

        <div className="order-details-page">

            <h1>

                جزئیات سفارش

            </h1>
            <button

                className="back-btn"

                onClick={() =>
                    navigate("/purchase/orders")
                }

            >

                بازگشت

            </button>

            <div className="details-grid">

                <div className="info-card">

                    <h3>

                        اطلاعات ساکن

                    </h3>

                    <p>

                        <strong>نام:</strong>

                        {order.resident.fullName}

                    </p>

                    <p>

                        <strong>موبایل:</strong>

                        {order.resident.mobile}

                    </p>

                </div>

                <div className="info-card">

                    <h3>

                        اطلاعات کمپین

                    </h3>

                    <p>

                        <strong>کمپین:</strong>

                        {order.campaign.campaignTitle}

                    </p>

                    <p>

                        <strong>وضعیت سفارش:</strong>

                        {orderStatusMap[order.status]}

                    </p>

                    <p>

                        <strong>وضعیت پرداخت:</strong>

                        {

                            order.paymentStatus

                                ?

                                paymentStatusMap[
                                order.paymentStatus
                                ]

                                :

                                "ثبت نشده"

                        }

                    </p>

                </div>

            </div>

            <h2>

                محصولات سفارش

            </h2>

            <table className="products-table">

                <thead>

                    <tr>

                        <th>محصول</th>

                        <th>تعداد</th>

                        <th>قیمت بازار</th>

                        <th>قیمت عمده</th>

                        <th>جمع عمده</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        order.preview.items.map(item => (

                            <tr key={item.campaignProductId}>

                                <td>

                                    {item.productName}

                                </td>

                                <td>

                                    {item.quantity}

                                </td>

                                <td>

                                    {

                                        item.marketUnitPrice.toLocaleString()

                                    }

                                </td>

                                <td>

                                    {

                                        item.bulkUnitPrice.toLocaleString()

                                    }

                                </td>

                                <td>

                                    {

                                        item.bulkTotal.toLocaleString()

                                    }

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

            <div className="summary-card">

                <h3>

                    خلاصه مالی

                </h3>

                <p>

                    جمع بازار:

                    {

                        order.preview.marketSubtotal.toLocaleString()

                    }

                </p>

                <p>

                    جمع عمده:

                    {

                        order.preview.bulkSubtotal.toLocaleString()

                    }

                </p>

                <p>

                    هزینه ارسال:

                    {

                        order.preview.totalShipping.toLocaleString()

                    }

                </p>

                <p>

                    صرفه‌جویی:

                    {

                        order.preview.totalSaving.toLocaleString()

                    }

                </p>

                <p>

                    مبلغ قابل پرداخت:

                    <strong>

                        {

                            order.preview.payableAmount.toLocaleString()

                        }

                        {" "}تومان

                    </strong>

                </p>

            </div>

            {

                order.payment && (

                    <div className="payment-card">

                        <h3>

                            اطلاعات پرداخت

                        </h3>

                        <p>

                            <strong>شماره پیگیری:</strong>

                            {order.payment.transactionRef}

                        </p>

                        <p>

                            <strong>مبلغ:</strong>

                            {

                                order.payment.amount.toLocaleString()

                            }

                            تومان

                        </p>

                        {

                            order.payment.rejectReason && (

                                <p>

                                    <strong>

                                        علت رد:

                                    </strong>

                                    {

                                        order.payment.rejectReason

                                    }

                                </p>

                            )

                        }

                        <a

                            href={`http://localhost:5000/${order.payment.receiptImage}`}

                            target="_blank"

                            rel="noreferrer"

                            className="details-btn"

                        >

                            مشاهده فیش

                        </a>

                    </div>

                )

            }

        </div>

    );

}