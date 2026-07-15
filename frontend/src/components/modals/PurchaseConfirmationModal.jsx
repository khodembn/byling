import "../../styles/Modal.css";

export default function PurchaseConfirmationModal({

    isOpen,

    products,

    managerMessage,

    setManagerMessage,

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
                        تایید شروع خرید عمده
                    </h2>

                </div>

                <div className="modal-body">

                    <p className="modal-description">

                        محصولات زیر پس از پایان مرحله پرداخت
                        به حد نصاب نرسیده‌اند.

                        در صورت تمایل می‌توانید با درج توضیح،
                        خرید عمده را ادامه دهید.

                    </p>

                    <div className="products-list">

                        {products.map((product) => (

                            <div
                                key={product.campaignProductId}
                                className="modal-product"
                            >

                                <h4>

                                    {product.productName}

                                </h4>

                                <div className="product-row">

                                    <span>
                                        حد نصاب:
                                    </span>

                                    <span>
                                        {product.thresholdQuantity}
                                    </span>

                                </div>

                                <div className="product-row">

                                    <span>
                                        مقدار فعلی:
                                    </span>

                                    <span>
                                        {product.currentQuantity}
                                    </span>

                                </div>

                                <div className="product-row missing">

                                    <span>
                                        کمبود:
                                    </span>

                                    <span>

                                        {product.missingQuantity}

                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>

                    <label>

                        توضیح مسئول خرید

                    </label>

                    <textarea

                        className="modal-textarea"

                        rows={5}

                        placeholder="نحوه جبران کمبود حد نصاب را توضیح دهید..."

                        value={managerMessage}

                        onChange={(e) =>
                            setManagerMessage(
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

                                ? "در حال ثبت..."

                                : "شروع خرید"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}