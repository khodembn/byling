import "../../styles/Modal.css";

export default function ReopenCampaignModal({

    isOpen,

    products,

    paymentDeadline,

    setPaymentDeadline,

    reopenMessage,

    setReopenMessage,

    loading,

    onClose,

    onConfirm,

}) {

    if (!isOpen) return null;

    return (

        <div className="modal-overlay">

            <div className="modal">

                <div className="modal-header">

                    <h2>

                        بازگشایی مجدد کمپین

                    </h2>

                </div>

                <div className="modal-body">

                    <p className="modal-description">

                        سفارش‌های پرداخت‌نشده لغو شدند.

                        محصولات زیر پس از این عملیات
                        حد نصاب خود را از دست داده‌اند.

                    </p>

                    {

                        products.length === 0 ? (

                            <div className="empty-products">

                                همه محصولات همچنان به حد نصاب رسیده‌اند.

                            </div>

                        ) : (

                            <div className="products-list">

                                {

                                    products.map((product) => (

                                        <div

                                            key={product.campaignProductId}

                                            className="modal-product"

                                        >

                                            <h4>

                                                {product.productName}

                                            </h4>

                                            <div className="product-row">

                                                <span>

                                                    حد نصاب

                                                </span>

                                                <span>

                                                    {product.thresholdQuantity}

                                                </span>

                                            </div>

                                            <div className="product-row">

                                                <span>

                                                    مقدار فعلی

                                                </span>

                                                <span>

                                                    {product.currentQuantity}

                                                </span>

                                            </div>

                                            <div className="product-row missing">

                                                <span>

                                                    کمبود

                                                </span>

                                                <span>

                                                    {product.missingQuantity}

                                                </span>

                                            </div>

                                        </div>

                                    ))

                                }

                            </div>

                        )

                    }

                    <label>

                        مهلت جدید ثبت سفارش

                    </label>

                    <input

                        className="modal-input"

                        type="datetime-local"

                        value={paymentDeadline}

                        onChange={(e) =>

                            setPaymentDeadline(

                                e.target.value

                            )

                        }

                    />

                    <label>

                        متن اعلان برای ساکنین

                    </label>

                    <textarea

                        className="modal-textarea"

                        rows={5}

                        placeholder="مثلاً:
به دلیل کاهش تعداد سفارش‌ها، کمپین دوباره فعال شد..."

                        value={reopenMessage}

                        onChange={(e) =>

                            setReopenMessage(

                                e.target.value

                            )

                        }

                    />

                </div>

                <div className="modal-footer">

                    <button

                        className="cancel-btn"

                        onClick={onClose}

                        disabled={loading}

                    >

                        انصراف

                    </button>

                    <button

                        className="confirm-btn"

                        onClick={onConfirm}

                        disabled={loading}

                    >

                        {

                            loading

                                ? "در حال بازگشایی..."

                                : "بازگشایی کمپین"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}