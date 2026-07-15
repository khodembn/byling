import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getCampaign,
    checkPurchasing,
    startPurchasing,
    cancelUnpaidOrders,
    readyForDelivery,
    completeCampaign
} from "../../api/campaignApi";

import ReadyForDeliveryModal
    from "../../components/modals/ReadyForDeliveryModal";

import PurchaseConfirmationModal
    from "../../components/modals/PurchaseConfirmationModal";

import ReopenCampaignModal
    from "../../components/modals/ReopenCampaignModal";

import { reopenCampaign }
    from "../../api/campaignApi";

import "../../styles/CampaignManagement.css";

export default function CampaignManagement() {
    const { id } = useParams();

    const navigate = useNavigate();

    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);

    const [loadingAction, setLoadingAction] =
        useState(false);

    const [missingProducts, setMissingProducts] =
        useState([]);

    const [showPurchaseModal, setShowPurchaseModal] =
        useState(false);

    const [showReopenModal, setShowReopenModal] =
        useState(false);

    const [managerMessage, setManagerMessage] =
        useState("");

    const [reopenMessage, setReopenMessage] =
        useState("");

    const [paymentDeadline, setPaymentDeadline] =
        useState("");

    const [showDeliveryModal, setShowDeliveryModal] =
        useState(false);

    const [deliveryMessage, setDeliveryMessage] =
        useState("");


    useEffect(() => {

        const fetchCampaign = async () => {

            try {
                const data =
                    await getCampaign(id);

                setCampaign(data);

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);

            }
        };

        fetchCampaign();

    }, [id]);

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
                return status || "-";
        }
    };
    const handleStartPurchasing = async () => {

        try {

            setLoadingAction(true);

            const result =
                await checkPurchasing(id);

            if (result.needConfirmation) {

                setMissingProducts(
                    result.products
                );

                setShowPurchaseModal(true);

                return;

            }

            await startPurchasing(id);

            alert("کمپین وارد مرحله خرید عمده شد.");

        } catch (err) {

            alert(
                err.response?.data?.message ||
                err.message
            );

        } finally {

            setLoadingAction(false);

        }

    };

    const handleCancelOrders = async () => {

        try {

            setLoadingAction(true);

            const result =
                await cancelUnpaidOrders(id);

            setMissingProducts(
                result.products
            );

            setShowReopenModal(true);

        } catch (err) {

            alert(
                err.response?.data?.message ||
                err.message
            );

        } finally {

            setLoadingAction(false);

        }

    };

    if (loading) {
        return <h2>در حال بارگذاری...</h2>;
    }


    return (

        <div className="campaign-management">
            <button

                className="back-btn"

                onClick={() =>
                    navigate("/purchase/campaigns")
                }

            >

                بازگشت

            </button>
            <h1>مدیریت کمپین</h1>
            <div className="campaign-info">

                <div className="info-card">

                    <h3>عنوان کمپین</h3>

                    <p>{campaign?.title || "-"}</p>

                </div>

                <div className="info-card">

                    <h3>وضعیت</h3>

                    <p>{getStatusLabel(campaign?.status)}</p>

                </div>

                <div className="info-card">

                    <h3>مهلت پرداخت</h3>

                    <p>

                        {campaign?.paymentDeadline
                            ? new Date(
                                campaign.paymentDeadline
                            ).toLocaleDateString("fa-IR")
                            : "-"}

                    </p>

                </div>

            </div>

            <div className="management-actions">

                {campaign.status === "AWAITING_PAYMENT" && (
                    <>
                        <div className="action-card">

                            <h2>ادامه خرید عمده</h2>

                            <p>
                                اگر همه شرایط برقرار باشد،
                                کمپین وارد مرحله خرید عمده خواهد شد.
                            </p>

                            <button
                                onClick={handleStartPurchasing}
                                className="purchase-btn"
                                disabled={loadingAction}
                            >
                                {loadingAction
                                    ? "در حال بررسی..."
                                    : "ادامه خرید"}
                            </button>

                        </div>

                        <div className="action-card">

                            <h2>بازگشایی مجدد کمپین</h2>

                            <p>
                                ابتدا سفارش‌های پرداخت‌نشده لغو می‌شوند
                                و در صورت نیاز کمپین دوباره فعال خواهد شد.
                            </p>

                            <button
                                onClick={handleCancelOrders}
                                className="reopen-btn"
                                disabled={loadingAction}
                            >
                                {loadingAction
                                    ? "در حال بررسی..."
                                    : "بازگشایی مجدد"}
                            </button>

                        </div>
                    </>
                )}

                {campaign.status === "PURCHASING" && (

                    <div className="action-card">

                        <h2>آماده تحویل</h2>

                        <p>
                            زمان و محل تحویل سفارش‌ها را
                            برای ساکنین ارسال کنید.
                        </p>

                        <button
                            className="purchase-btn"
                            disabled={loadingAction}
                            onClick={() => setShowDeliveryModal(true)}
                        >
                            آماده تحویل
                        </button>

                    </div>

                )}

                {campaign.status === "READY_FOR_DELIVERY" && (

                    <div className="action-card">

                        <h2>پایان کمپین</h2>

                        <p>
                            پس از تحویل سفارش‌ها،
                            کمپین را به پایان برسانید.
                        </p>

                        <button
                            className="reopen-btn"
                            disabled={loadingAction}
                            onClick={async () => {

                                if (
                                    !window.confirm(
                                        "آیا از پایان کمپین مطمئن هستید؟"
                                    )
                                ) return;

                                try {

                                    setLoadingAction(true);

                                    await completeCampaign(id);

                                    alert("کمپین با موفقیت تکمیل شد.");

                                    const data = await getCampaign(id);

                                    setCampaign(data);

                                } catch (err) {

                                    alert(
                                        err.response?.data?.message ||
                                        err.message
                                    );

                                } finally {

                                    setLoadingAction(false);

                                }

                            }}
                        >
                            پایان کمپین
                        </button>

                    </div>

                )}

            </div>
            <PurchaseConfirmationModal

                isOpen={showPurchaseModal}

                products={missingProducts}

                managerMessage={managerMessage}

                setManagerMessage={setManagerMessage}

                loading={loadingAction}

                onClose={() => {

                    setShowPurchaseModal(false);

                    setManagerMessage("");

                }}

                onConfirm={async () => {

                    try {

                        setLoadingAction(true);

                        await startPurchasing(

                            id,

                            managerMessage

                        );

                        alert("کمپین وارد مرحله خرید عمده شد.");

                        setShowPurchaseModal(false);

                    } catch (err) {

                        alert(
                            err.response?.data?.message ||
                            err.message
                        );

                    } finally {

                        setLoadingAction(false);

                    }

                }}

            />
            <ReopenCampaignModal

                isOpen={showReopenModal}

                products={missingProducts}

                paymentDeadline={paymentDeadline}

                setPaymentDeadline={setPaymentDeadline}

                reopenMessage={reopenMessage}

                setReopenMessage={setReopenMessage}

                loading={loadingAction}

                onClose={() => {

                    setShowReopenModal(false);

                    setPaymentDeadline("");

                    setReopenMessage("");

                }}

                onConfirm={async () => {

                    try {

                        setLoadingAction(true);

                        await reopenCampaign(

                            id,

                            paymentDeadline,

                            reopenMessage

                        );

                        alert("کمپین با موفقیت بازگشایی شد.");

                        setShowReopenModal(false);

                    } catch (err) {

                        alert(

                            err.response?.data?.message ||

                            err.message

                        );

                    } finally {

                        setLoadingAction(false);

                    }

                }}

            />
            <ReadyForDeliveryModal

                isOpen={showDeliveryModal}

                message={deliveryMessage}

                setMessage={setDeliveryMessage}

                loading={loadingAction}

                onClose={() => {

                    setShowDeliveryModal(false);

                    setDeliveryMessage("");

                }}

                onConfirm={async () => {

                    try {

                        setLoadingAction(true);

                        await readyForDelivery(
                            id,
                            deliveryMessage
                        );

                        alert("اعلان آماده تحویل ارسال شد.");

                        const data = await getCampaign(id);

                        setCampaign(data);

                        setShowDeliveryModal(false);

                        setDeliveryMessage("");

                    } catch (err) {

                        alert(
                            err.response?.data?.message ||
                            err.message
                        );

                    } finally {

                        setLoadingAction(false);

                    }

                }}

            />

        </div>

    );

}