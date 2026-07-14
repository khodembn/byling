import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import {
    getManagerPaymentInfo,
} from "../../api/userApi";

import {
    requestPayment,
} from "../../api/campaignApi";

import "../../styles/RequestPaymentModal.css";

export default function RequestPaymentModal({

    open,

    onClose,

    campaignId,

    onSuccess,

}) {

    const [loading, setLoading] =
        useState(false);

    const [cardInfo, setCardInfo] =
        useState(null);

    const [paymentDeadline, setPaymentDeadline] =
        useState("");



    useEffect(() => {

        if (!open) return;

        fetchCardInfo();

    }, [open]);



    const fetchCardInfo = async () => {

        try {

            const data =
                await getManagerPaymentInfo();

            setCardInfo(data);

        }

        catch (err) {

            console.log(err);

            toast.error(
                "خطا در دریافت اطلاعات کارت"
            );

        }

    };



    const handleSubmit = async () => {

        if (!paymentDeadline) {

            toast.warning(
                "مهلت پرداخت را انتخاب کنید."
            );

            return;

        }

        try {

            setLoading(true);

            await requestPayment(

                campaignId,

                paymentDeadline

            );

            toast.success(
                "درخواست پرداخت ارسال شد."
            );

            onSuccess?.();

        }

        catch (err) {

            console.log(err);

            toast.error(

                err.response?.data?.message ||

                "خطا در ارسال درخواست پرداخت"

            );

        }

        finally {

            setLoading(false);

        }

    };



    if (!open) return null;



    return (

        <div className="modal-overlay">

            <div className="payment-modal">

                <h2>

                    درخواست پرداخت

                </h2>

                <p className="payment-description">
                    اطلاعات کارت از پروفایل مسئول خرید دریافت شده است.
                    <br />
                    این اطلاعات برای همین کمپین ذخیره می‌شود و
                    تغییرات بعدی پروفایل روی این کمپین تاثیری ندارد.
                </p>

                <div className="payment-info">

                    <label>

                        شماره کارت

                    </label>

                    <input

                        value={

                            cardInfo?.paymentCardNumber ||

                            ""

                        }

                        disabled

                    />



                    <label>

                        نام صاحب کارت

                    </label>

                    <input

                        value={

                            cardInfo?.paymentCardHolder ||

                            ""

                        }

                        disabled

                    />



                    <label>

                        مهلت پرداخت

                    </label>

                    <input

                        type="datetime-local"

                        value={paymentDeadline}

                        onChange={(e) =>

                            setPaymentDeadline(

                                e.target.value

                            )

                        }

                    />

                </div>



                <div className="modal-actions">

                    <button

                        className="cancel-btn"

                        onClick={onClose}

                    >

                        انصراف

                    </button>



                    <button

                        className="submit-btn"

                        onClick={handleSubmit}

                        disabled={loading}

                    >

                        {

                            loading

                                ?

                                "در حال ارسال..."

                                :

                                "ارسال درخواست پرداخت"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}