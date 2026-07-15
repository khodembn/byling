import { useEffect, useState } from "react";

import {
    getCart,
    getOrderPreview,
    createOrUpdateOrder,
    submitOrderApi,
} from "../../api/orderApi";

import PreviewModal from "../../components/modals/PreviewModal";
import "../../styles/ResidentCart.css";

export default function ResidentCart() {


    const [carts, setCarts] = useState([]);

    const [previews, setPreviews] = useState({});

    const [selectedPreview, setSelectedPreview] = useState({
        data: null,
        title: ""
    });

    const [loading, setLoading] = useState(true);

    const [updating, setUpdating] = useState(false);

    const [error, setError] = useState("");





    const fetchCart = async () => {

        try {

            setLoading(true);


            const data = await getCart();


            setCarts(data);



            const previewList = {};



            for (const cart of data) {


                const preview =
                    await getOrderPreview(
                        cart.campaignId
                    );


                previewList[
                    cart.campaignId
                ] = preview;


            }


            setPreviews(previewList);



        }
        catch (err) {

            console.error(err);


            setError(
                err.response?.data?.message ||
                "خطا در دریافت سبد خرید"
            );

        }
        finally {

            setLoading(false);

        }

    };





    useEffect(() => {

        fetchCart();

    }, []);






    const updateQuantity = async (
        campaignId,
        item,
        quantity
    ) => {


        if (quantity < 0)
            return;



        try {


            setUpdating(true);



            await createOrUpdateOrder({

                campaignId,


                items: [

                    {

                        campaignProductId:
                            item.campaignProductId,


                        quantity

                    }

                ]

            });



            await fetchCart();



        }
        catch (err) {


            console.error(err);


            setError(
                err.response?.data?.message ||
                "خطا در تغییر تعداد"
            );


        }
        finally {


            setUpdating(false);


        }


    };








    const handleSubmitOrder = async (orderId) => {


        try {


            await submitOrderApi(orderId);


            await fetchCart();



        }
        catch (err) {


            setError(
                err.response?.data?.message ||
                "خطا در ثبت سفارش"
            );


        }


    };







    const openPreview = (cart) => {


        setSelectedPreview({

            data:
                previews[cart.campaignId],


            title:
                cart.campaignTitle

        });


    };







    const closePreview = () => {


        setSelectedPreview({

            data: null,

            title: ""

        });


    };







    if (loading) {

        return <h2>
            در حال بارگذاری...
        </h2>;

    }







    if (carts.length === 0) {

        return <h2>
            سبد خرید خالی است
        </h2>;

    }







    return (

        <div className="resident-cart">


            <h1>
                سبد خرید من
            </h1>



            {
                error &&

                <p className="error-message">

                    {error}

                </p>
            }





            {
                carts.map(cart => (


                    <div

                        key={cart.orderId}

                        className="cart-card"

                    >



                        <div className="cart-header">


                            <h2>
                                {cart.campaignTitle}
                            </h2>


                            <span>

                                {cart.totalQuantity}

                                {" "}کالا

                            </span>


                        </div>







                        {
                            cart.items.map(item => (


                                <div

                                    key={
                                        item.campaignProductId
                                    }

                                    className="cart-item"

                                >




                                    {

                                        item.imageUrl ?

                                            (

                                                <img

                                                    src={
                                                        `http://localhost:5000${item.imageUrl}`
                                                    }

                                                    width={80}

                                                    alt={
                                                        item.productName
                                                    }

                                                />

                                            )

                                            :

                                            (

                                                <div>
                                                    📦
                                                </div>

                                            )

                                    }





                                    <div>


                                        <h4>
                                            {item.productName}
                                        </h4>




                                        <div className="quantity-box">


                                            <button

                                                disabled={updating}

                                                onClick={() =>


                                                    updateQuantity(

                                                        cart.campaignId,

                                                        item,

                                                        item.quantity - 1

                                                    )


                                                }

                                            >

                                                -

                                            </button>





                                            <span>

                                                {item.quantity}

                                            </span>





                                            <button

                                                disabled={updating}

                                                onClick={() =>


                                                    updateQuantity(

                                                        cart.campaignId,

                                                        item,

                                                        item.quantity + 1

                                                    )


                                                }

                                            >

                                                +

                                            </button>



                                        </div>



                                    </div>






                                    <strong>

                                        {
                                            item.totalPrice
                                                .toLocaleString()
                                        }

                                        {" "}تومان

                                    </strong>




                                </div>


                            ))

                        }






                        <hr />







                        <div className="cart-summary">


                            <p>

                                صرفه‌جویی:

                                {" "}

                                {
                                    cart.totalSaving
                                        .toLocaleString()
                                }

                                تومان

                            </p>





                            <h3>

                                مبلغ قابل پرداخت:

                                {" "}

                                {
                                    cart.payableAmount
                                        .toLocaleString()
                                }

                                تومان

                            </h3>


                        </div>








                        <div className="cart-actions">



                            <button

                                onClick={() => openPreview(cart)}

                            >

                                مشاهده پیش فاکتور

                            </button>






                            <button

                                onClick={() =>


                                    handleSubmitOrder(
                                        cart.orderId
                                    )


                                }

                            >

                                ثبت نهایی سفارش

                            </button>



                        </div>




                    </div>


                ))

            }







            {
                selectedPreview.data &&


                (

                    <PreviewModal


                        preview={
                            selectedPreview.data
                        }


                        campaignTitle={
                            selectedPreview.title
                        }


                        onClose={
                            closePreview
                        }


                    />

                )

            }





        </div>

    );

}