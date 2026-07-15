import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getPaymentDetails,
    approvePayment,
    rejectPayment,
} from "../../api/paymentApi";


import "../../styles/PaymentDetails.css";

const API_URL = "http://localhost:5000";

export default function PaymentDetails() {

    const { paymentId } = useParams();

    const navigate = useNavigate();

    const [payment, setPayment] = useState(null);

    const [loading, setLoading] = useState(true);

    const [showRejectModal, setShowRejectModal] = useState(false);

    const [rejectReason, setRejectReason] = useState("");

    const fetchPayment = async () => {

        try {

            const data = await getPaymentDetails(paymentId);

            setPayment(data);

        } catch (err) {

            console.error(err);

            alert("خطا در دریافت اطلاعات پرداخت");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchPayment();

    }, [paymentId]);

    const handleApprove = async () => {

        const ok = window.confirm(
            "آیا از تایید این پرداخت مطمئن هستید؟"
        );

        if (!ok) return;

        try {

            await approvePayment(paymentId);

            alert("پرداخت با موفقیت تایید شد.");

            navigate("/purchase/payments");

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "خطا در تایید پرداخت"
            );

        }

    };

    const handleReject = async () => {

        if (!rejectReason.trim()) {

            alert("علت رد پرداخت را وارد کنید.");

            return;

        }

        try {

            await rejectPayment(
                paymentId,
                rejectReason
            );

            alert("پرداخت رد شد.");

            navigate("/purchase/payments");

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "خطا در رد پرداخت"
            );

        }

    };

    if (loading) {

        return <h2>در حال دریافت اطلاعات...</h2>;

    }

    if (!payment) {

        return <h2>اطلاعات پرداخت پیدا نشد.</h2>;

    }

    return (

        <div className="payment-details-page">

            <div className="details-header">

                <h1>

                    جزئیات پرداخت

                </h1>

                <button

                    className="back-btn"

                    onClick={() =>
                        navigate("/purchase/payments")
                    }

                >

                    بازگشت

                </button>

            </div>

            <div className="payment-info-card">

                <div>

                    <strong>

                        وضعیت:

                    </strong>

                    {" "}

                    {payment.paymentStatus}

                </div>

                <div>

                    <strong>

                        نام ساکن:

                    </strong>

                    {" "}

                    {payment.resident.residentName}

                </div>

                <div>

                    <strong>

                        موبایل:

                    </strong>

                    {" "}

                    {payment.resident.mobile}

                </div>

                <div>

                    <strong>

                        کمپین:

                    </strong>

                    {" "}

                    {payment.campaign.campaignTitle}

                </div>

                <div>

                    <strong>

                        مبلغ:

                    </strong>

                    {" "}

                    {payment.amount.toLocaleString()}

                    تومان

                </div>

                <div>

                    <strong>

                        شماره تراکنش:

                    </strong>

                    {" "}

                    {payment.transactionRef}

                </div>

            </div>

            <div className="receipt-section">

                <h2>

                    تصویر فیش

                </h2>

                <img

                    className="receipt-image"

                    src={`${API_URL}/${payment.receiptImage}`}

                    alt="رسید پرداخت"

                />

            </div>

            <h2>

                اقلام سفارش

            </h2>

            <table className="items-table">

                <thead>

                    <tr>

                        <th>

                            محصول

                        </th>

                        <th>

                            تعداد

                        </th>

                        <th>

                            قیمت عمده

                        </th>

                        <th>

                            جمع

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        payment.preview.items.map(item => (

                            <tr

                                key={item.campaignProductId}

                            >

                                <td>

                                    {item.productName}

                                </td>

                                <td>

                                    {item.quantity}

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

            <div className="invoice-summary">

                <div>

                    جمع عمده:

                    {" "}

                    {

                        payment.preview.bulkSubtotal.toLocaleString()

                    }

                </div>

                <div>

                    هزینه ارسال:

                    {" "}

                    {

                        payment.preview.totalShipping.toLocaleString()

                    }

                </div>

                <div>

                    کارمزد مسئول خرید:

                    {" "}

                    {

                        payment.preview.managerCommission.toLocaleString()

                    }

                </div>

                <div>

                    کارمزد پلتفرم:

                    {" "}

                    {

                        payment.preview.platformCommission.toLocaleString()

                    }

                </div>

                <div className="payable">

                    مبلغ قابل پرداخت:

                    {" "}

                    {

                        payment.preview.payableAmount.toLocaleString()

                    }

                    تومان

                </div>

            </div>

            {

                payment.paymentStatus === "PENDING" && (

                    <div className="actions">

                        <button

                            className="approve-btn"

                            onClick={handleApprove}

                        >

                            تایید پرداخت

                        </button>

                        <button

                            className="reject-btn"

                            onClick={() =>
                                setShowRejectModal(true)
                            }

                        >

                            رد پرداخت

                        </button>

                    </div>

                )

            }

            {

                showRejectModal && (

                    <div className="modal-overlay">

                        <div className="reject-modal">

                            <h2>

                                علت رد پرداخت

                            </h2>

                            <textarea

                                rows={5}

                                value={rejectReason}

                                onChange={(e) =>
                                    setRejectReason(
                                        e.target.value
                                    )
                                }

                                placeholder="علت رد پرداخت را وارد کنید"

                            />

                            <div className="modal-buttons">

                                <button

                                    className="approve-btn"

                                    onClick={handleReject}

                                >

                                    ثبت

                                </button>

                                <button

                                    className="cancel-btn"

                                    onClick={() =>
                                        setShowRejectModal(false)
                                    }

                                >

                                    انصراف

                                </button>

                            </div>

                        </div>

                    </div>

                )

            }

        </div>

    );

}