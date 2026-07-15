import { useEffect, useState } from "react";
import {
    getMyPayments,
    uploadReceipt
} from "../../api/paymentApi";
import api from "../../api/axios";

import "../../styles/ResidentPayments.css";
const paymentStatusMap = {
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

export default function ResidentPayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedReceipt, setSelectedReceipt] = useState(null);

    const fetchPayments = async () => {
        try {
            const data = await getMyPayments();
            setPayments(data);
        } catch (error) {
            console.error(error);
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
            <div className="resident-payments-page">
                <h2>در حال دریافت اطلاعات...</h2>
            </div>
        );
    }

    return (
        <div className="resident-payments-page">

            <h1>پرداخت‌های من</h1>

            {payments.length === 0 ? (
                <p>هنوز هیچ پرداختی ثبت نشده است.</p>
            ) : (
                <div className="payments-list">

                    {payments.map((payment) => {

                        const status =
                            paymentStatusMap[payment.paymentStatus];

                        return (
                            <div
                                className="payment-card"
                                key={payment.paymentId}
                            >

                                <div className="payment-header">

                                    <h2>
                                        {payment.campaignTitle}
                                    </h2>

                                    <span
                                        className={`payment-status ${status.className}`}
                                    >
                                        {status.text}
                                    </span>

                                </div>

                                <div className="payment-body">

                                    <p>

                                        <strong>
                                            مبلغ پرداخت:
                                        </strong>

                                        {" "}

                                        {payment.amount.toLocaleString()}

                                        {" "}تومان

                                    </p>

                                    <p>

                                        <strong>
                                            تاریخ ثبت:
                                        </strong>

                                        {" "}

                                        {new Date(
                                            payment.createdAt
                                        ).toLocaleDateString("fa-IR")}

                                    </p>

                                    {payment.rejectReason && (

                                        <p className="reject-reason">

                                            <strong>
                                                علت رد:
                                            </strong>

                                            {" "}

                                            {payment.rejectReason}

                                        </p>

                                    )}

                                </div>

                                <div className="payment-actions">

                                    <button
                                        onClick={() =>
                                            setSelectedReceipt(
                                                `${api.defaults.baseURL.replace("/api", "")}/${payment.receiptImage}`
                                            )
                                        }
                                    >
                                        مشاهده فیش
                                    </button>

                                    {payment.paymentStatus ===
                                        "REJECTED" && (

                                            <button
                                                onClick={() =>
                                                    window.location.href =
                                                    `/resident/payment/${payment.orderId}`
                                                }
                                            >
                                                ارسال مجدد فیش
                                            </button>

                                        )}

                                </div>

                            </div>
                        );
                    })}
                </div>
            )}

            {selectedReceipt && (

                <div
                    className="receipt-modal"
                    onClick={() =>
                        setSelectedReceipt(null)
                    }
                >

                    <div
                        className="receipt-content"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            className="close-btn"
                            onClick={() =>
                                setSelectedReceipt(null)
                            }
                        >
                            ✕
                        </button>

                        <img
                            src={selectedReceipt}
                            alt="رسید پرداخت"
                        />

                    </div>

                </div>

            )}

        </div>
    );
}