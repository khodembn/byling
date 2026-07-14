import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getCampaignProducts } from "../../api/campaignProductApi";
import {
    getMyOrder,
    createOrUpdateOrder,
} from "../../api/orderApi";

import { useCart } from "../../contexts/CartContext";


export default function ResidentCampaignView() {

    const { id } = useParams();

    const [products, setProducts] = useState([]);
    const [order, setOrder] = useState({
        items: []
    });
    const { refreshCartCount } = useCart();
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchData();

    }, [id]);

    const fetchData = async () => {

        try {

            const [productsData, orderData] =
                await Promise.all([

                    getCampaignProducts(id),

                    getMyOrder(id),

                ]);

            setProducts(productsData);

            setOrder(orderData);


            await refreshCartCount();
        }

        catch (err) {

            console.error(err);

        }

        finally {

            setLoading(false);

        }

    };

    const getProductQuantity = (campaignProductId) => {

        const item = order.items?.find(

            item =>
                item.campaignProductId ===
                campaignProductId

        );

        return item ? item.quantity : 0;

    };

    const increaseQuantity = async (product) => {

        const quantity = getProductQuantity(

            product.campaignProductId

        );

        await createOrUpdateOrder({

            campaignId: Number(id),

            items: [
                {
                    campaignProductId:
                        product.campaignProductId,

                    quantity: quantity + 1
                }
            ]

        });
        await refreshCartCount();
        setOrder(prev => {

            const oldItems = prev.items || [];

            const exists = oldItems.find(
                item =>
                    Number(item.campaignProductId) ===
                    Number(product.campaignProductId)
            );


            if (exists) {

                return {

                    ...prev,

                    items: oldItems.map(item =>

                        Number(item.campaignProductId) ===
                            Number(product.campaignProductId)

                            ?

                            {
                                ...item,
                                quantity: quantity + 1
                            }

                            :

                            item

                    )

                };

            }


            return {

                ...prev,

                items: [
                    ...oldItems,

                    {
                        campaignProductId:
                            product.campaignProductId,

                        quantity:
                            quantity + 1
                    }
                ]

            };

        });

    };

    const decreaseQuantity = async (product) => {

        const quantity = getProductQuantity(

            product.campaignProductId

        );

        if (quantity === 0) return;

        await createOrUpdateOrder({

            campaignId: Number(id),

            items: [

                {

                    campaignProductId:
                        product.campaignProductId,

                    quantity: quantity - 1

                }

            ]

        });
        await refreshCartCount();

        setOrder(prev => ({

            ...prev,

            items: prev.items
                .map(item =>

                    Number(item.campaignProductId) ===
                        Number(product.campaignProductId)

                        ?

                        {
                            ...item,
                            quantity: quantity - 1
                        }

                        :

                        item

                )
                .filter(item => item.quantity > 0)

        }));

    };

    if (loading) {

        return <h2>در حال بارگذاری...</h2>;

    }

    return (

        <div>

            <h1>

                محصولات کمپین

            </h1>

            {

                products.length === 0 ?

                    (

                        <p>

                            محصولی برای این کمپین ثبت نشده است.

                        </p>

                    )

                    :

                    (

                        products.map(product => {

                            const quantity =
                                getProductQuantity(
                                    product.campaignProductId
                                );

                            return (

                                <div

                                    key={product.campaignProductId}

                                    className="resident-product-card"

                                >

                                    {

                                        product.imageUrl ?

                                            (

                                                <img

                                                    src={`http://localhost:5000${product.imageUrl}`}

                                                    alt={product.productName}

                                                    width={120}

                                                />

                                            )

                                            :

                                            (

                                                <div className="product-placeholder">

                                                    📦

                                                </div>

                                            )

                                    }

                                    <h2>

                                        {product.productName}

                                    </h2>

                                    <p>

                                        قیمت فروشگاه :

                                        {" "}

                                        {product.marketPrice.toLocaleString()}

                                        تومان

                                    </p>

                                    <p>

                                        قیمت کمپین :

                                        {" "}

                                        {product.bulkPrice.toLocaleString()}

                                        تومان

                                    </p>

                                    <p>

                                        صرفه جویی :

                                        {" "}

                                        {product.saving.toLocaleString()}

                                        تومان

                                    </p>

                                    <p>

                                        درصد تخفیف :

                                        {" "}

                                        {product.savingPercent}%

                                    </p>

                                    <p>

                                        هزینه ارسال :

                                        {" "}

                                        {product.shippingCost.toLocaleString()}

                                        تومان

                                    </p>

                                    <p>

                                        حد نصاب :

                                        {" "}

                                        {product.thresholdQuantity}

                                    </p>

                                    <p>

                                        تعداد ثبت شده :

                                        {" "}

                                        {product.currentQuantity}

                                    </p>

                                    <p>

                                        وضعیت :

                                        {" "}

                                        {product.status}

                                    </p>

                                    <div className="quantity-box">

                                        {

                                            quantity === 0 ?

                                                (

                                                    <button

                                                        onClick={() =>

                                                            increaseQuantity(product)

                                                        }

                                                    >

                                                        +

                                                    </button>

                                                )

                                                :

                                                (

                                                    <>

                                                        <button

                                                            onClick={() =>

                                                                decreaseQuantity(product)

                                                            }

                                                        >

                                                            -

                                                        </button>

                                                        <span>

                                                            {quantity}

                                                        </span>

                                                        <button

                                                            onClick={() =>

                                                                increaseQuantity(product)

                                                            }

                                                        >

                                                            +

                                                        </button>

                                                    </>

                                                )

                                        }

                                    </div>

                                </div>

                            );

                        })

                    )

            }

        </div>

    );

}