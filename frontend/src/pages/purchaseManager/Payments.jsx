import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getManagerPayments,
} from "../../api/paymentApi";

import "../../styles/ManagerPayment.css";

const statusMap = {

    PENDING: {

        text: "🟡 در حال بررسی",

        className: "pending",

    },

    APPROVED: {

        text: "🟢 تایید شده",

        className: "approved",

    },

    REJECTED: {

        text: "🔴 رد شده",

        className: "rejected",

    },

};

export default function Payments() {

    const navigate = useNavigate();

    const [payments, setPayments] = useState([]);

    const [loading, setLoading] = useState(true);

    const fetchPayments = async () => {

        try {

            const data = await getManagerPayments();

            setPayments(data);

        } catch (err) {

            console.error(err);

            alert("خطا در دریافت پرداخت‌ها");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchPayments();

    }, []);

    if (loading) {

        return (

            <div className="payments-page">

                <h2>در حال دریافت اطلاعات...</h2>

            </div>

        );

    }

    return (

        <div className="payments-page">

            <div className="page-header">

                <h1>

                    مدیریت پرداخت‌ها

                </h1>

            </div>

            {

                payments.length === 0 ?

                    (

                        <div className="empty-box">

                            هیچ پرداختی وجود ندارد.

                        </div>

                    )

                    :

                    (

                        <table className="payments-table">

                            <thead>

                                <tr>

                                    <th>نام ساکن</th>

                                    <th>کمپین</th>

                                    <th>مبلغ</th>

                                    <th>تاریخ</th>

                                    <th>وضعیت</th>

                                    <th>عملیات</th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    payments.map((payment) => {

                                        const status =
                                            statusMap[payment.paymentStatus];

                                        return (

                                            <tr
                                                key={payment.paymentId}
                                            >

                                                <td>

                                                    {payment.residentName}

                                                </td>

                                                <td>

                                                    {payment.campaignTitle}

                                                </td>

                                                <td>

                                                    {payment.amount.toLocaleString()}

                                                    {" "}تومان

                                                </td>

                                                <td>

                                                    {

                                                        new Date(

                                                            payment.createdAt

                                                        ).toLocaleDateString(

                                                            "fa-IR"

                                                        )

                                                    }

                                                </td>

                                                <td>

                                                    <span
                                                        className={`status ${status.className}`}
                                                    >

                                                        {status.text}

                                                    </span>

                                                </td>

                                                <td>

                                                    <button

                                                        className="details-btn"

                                                        onClick={() =>

                                                            navigate(

                                                                `/purchase/payments/${payment.paymentId}`

                                                            )

                                                        }

                                                    >

                                                        {

                                                            payment.paymentStatus === "PENDING"

                                                                ? "بررسی"

                                                                : "مشاهده"

                                                        }

                                                    </button>

                                                </td>

                                            </tr>

                                        );

                                    })

                                }

                            </tbody>

                        </table>

                    )

            }

        </div>

    );

}