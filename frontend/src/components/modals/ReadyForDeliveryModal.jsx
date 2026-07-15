import "../../styles/ReadyForDelivery.css";


export default function ReadyForDeliveryModal({

    isOpen,

    message,

    setMessage,

    loading,

    onClose,

    onConfirm,

}) {

    if (!isOpen) return null;

    return (

        <div className="modal-overlay">

            <div className="modal">

                <h2>

                    آماده تحویل شدن سفارش‌ها

                </h2>

                <p className="modal-description">

                    لطفاً زمان، تاریخ و محل تحویل سفارش‌ها را
                    وارد کنید. این متن برای ساکنین به صورت
                    اعلان ارسال خواهد شد.

                </p>

                <textarea

                    value={message}

                    onChange={(e) =>
                        setMessage(e.target.value)
                    }

                    rows={6}

                    placeholder="مثال:
سفارش‌ها آماده تحویل هستند.
لطفاً روز چهارشنبه ساعت ۱۸ تا ۲۰
به لابی ساختمان مراجعه کنید."

                />

                <div className="modal-actions">

                    <button

                        className="cancel-btn"

                        onClick={onClose}

                        disabled={loading}

                    >

                        انصراف

                    </button>

                    <button

                        className="confirm-btn"

                        disabled={
                            loading ||
                            message.trim() === ""
                        }

                        onClick={onConfirm}

                    >

                        {loading
                            ? "در حال ارسال..."
                            : "ثبت و ارسال اعلان"}

                    </button>

                </div>

            </div>

        </div>

    );

}