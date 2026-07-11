
import { useState } from "react";

export default function ProductFormModal({

    open,

    product,

    onClose,

    onSubmit,

}) {

    const [marketPrice, setMarketPrice] = useState("");

    const [bulkPrice, setBulkPrice] = useState("");

    const [shippingCost, setShippingCost] = useState("");

    const [thresholdQuantity, setThresholdQuantity] = useState("");

    if (!open || !product) return null;

    const handleSubmit = () => {

        onSubmit({

            productId: product.productId,

            marketPriceSnapshot: Number(marketPrice),

            bulkPrice: Number(bulkPrice),

            shippingCost: Number(shippingCost),

            thresholdQuantity: Number(thresholdQuantity),

        });

    };

    return (

        <div className="modal-overlay">

            <div className="modal">

                <h2>

                    افزودن محصول

                </h2>

                <h3>

                    {product.productName}

                </h3>

                <p>

                    {product.description}

                </p>

                <input

                    placeholder="قیمت فروشگاه"

                    value={marketPrice}

                    onChange={(e) =>

                        setMarketPrice(e.target.value)

                    }

                />

                <input

                    placeholder="قیمت عمده"

                    value={bulkPrice}

                    onChange={(e) =>

                        setBulkPrice(e.target.value)

                    }

                />

                <input

                    placeholder="هزینه ارسال"

                    value={shippingCost}

                    onChange={(e) =>

                        setShippingCost(e.target.value)

                    }

                />

                <input

                    placeholder="حد نصاب"

                    value={thresholdQuantity}

                    onChange={(e) =>

                        setThresholdQuantity(e.target.value)

                    }

                />

                <button

                    onClick={handleSubmit}

                >

                    ثبت محصول

                </button>

                <button

                    onClick={onClose}

                >

                    انصراف

                </button>

            </div>

        </div>

    );

}