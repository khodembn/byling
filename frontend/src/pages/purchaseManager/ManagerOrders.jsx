import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getManagerOrders } from "../../api/orderApi";

import "../../styles/ManagerOrder.css";


const orderStatusMap = {

    CART: {
        text: "سبد خرید",
        className: "cart",
    },

    SUBMITTED: {
        text: "ثبت شده",
        className: "submitted",
    },

    INITIAL_INVOICED: {
        text: "پیش‌فاکتور صادر شده",
        className: "initial-invoiced",
    },

    PAID: {
        text: "پرداخت شده",
        className: "paid",
    },

    FINAL_INVOICED: {
        text: "فاکتور نهایی",
        className: "final-invoiced",
    },

    READY_FOR_DELIVERY: {
        text: "آماده تحویل",
        className: "ready",
    },

    DELIVERED: {
        text: "تحویل شده",
        className: "delivered",
    },

    CANCELLED: {
        text: "لغو شده",
        className: "cancelled",
    },

};



const paymentStatusMap = {

    null: {
        text: "-",
        className: "none",
    },

    PENDING: {
        text: "🟡 در انتظار بررسی",
        className: "payment-pending",
    },

    APPROVED: {
        text: "🟢 تایید شده",
        className: "payment-approved",
    },

    REJECTED: {
        text: "🔴 رد شده",
        className: "payment-rejected",
    },

};



export default function ManagerOrders() {


    const navigate = useNavigate();


    const [orders, setOrders] = useState([]);


    const [loading, setLoading] = useState(true);



    const fetchOrders = async () => {

        try {

            const data =
                await getManagerOrders();


            setOrders(data || []);

        }

        catch (err) {

            console.error(
                "Manager Orders Error:",
                err
            );


            alert(
                "خطا در دریافت سفارش‌ها"
            );

        }

        finally {

            setLoading(false);

        }

    };



    useEffect(() => {

        fetchOrders();

    }, []);




    if (loading) {

        return (

            <div className="orders-page">

                <h2>
                    در حال دریافت سفارش‌ها...
                </h2>

            </div>

        );

    }





    return (

        <div className="orders-page">


            <div className="page-header">

                <h1>
                    سفارش‌های ساکنین
                </h1>

            </div>





            {
                orders.length === 0 ?


                    (

                        <div className="empty-box">

                            سفارشی وجود ندارد.

                        </div>

                    )


                    :


                    (

                        <table className="orders-table">


                            <thead>

                                <tr>

                                    <th>
                                        ساکن
                                    </th>


                                    <th>
                                        کمپین
                                    </th>


                                    <th>
                                        مبلغ
                                    </th>


                                    <th>
                                        وضعیت سفارش
                                    </th>


                                    <th>
                                        وضعیت پرداخت
                                    </th>


                                    <th>
                                        تاریخ
                                    </th>


                                    <th>
                                        عملیات
                                    </th>

                                </tr>

                            </thead>





                            <tbody>


                                {
                                    orders.map(order => {


                                        const orderStatus =
                                            orderStatusMap[order.status]
                                            ||
                                            {
                                                text: order.status,
                                                className: "unknown"
                                            };



                                        const paymentStatus =
                                            paymentStatusMap[
                                            order.paymentStatus ?? "null"
                                            ]
                                            ||
                                            paymentStatusMap.null;




                                        return (

                                            <tr
                                                key={
                                                    order.orderId
                                                }
                                            >



                                                <td>
                                                    {
                                                        order.residentName
                                                        ||
                                                        "-"
                                                    }
                                                </td>



                                                <td>

                                                    {
                                                        order.campaignTitle
                                                        ||
                                                        "-"
                                                    }

                                                </td>




                                                <td>

                                                    {
                                                        Number(
                                                            order.payableAmount || 0
                                                        )
                                                            .toLocaleString()
                                                    }

                                                    {" "}
                                                    تومان

                                                </td>




                                                <td>


                                                    <span

                                                        className={
                                                            `status ${orderStatus.className}`
                                                        }

                                                    >

                                                        {
                                                            orderStatus.text
                                                        }

                                                    </span>


                                                </td>





                                                <td>


                                                    <span

                                                        className={
                                                            `status ${paymentStatus.className}`
                                                        }

                                                    >

                                                        {
                                                            paymentStatus.text
                                                        }

                                                    </span>


                                                </td>





                                                <td>

                                                    {
                                                        order.createdAt

                                                            ?

                                                            new Date(
                                                                order.createdAt
                                                            )
                                                                .toLocaleDateString(
                                                                    "fa-IR"
                                                                )

                                                            :

                                                            "-"
                                                    }

                                                </td>





                                                <td>


                                                    <button

                                                        className="details-btn"


                                                        onClick={() =>

                                                            navigate(
                                                                `/purchase/order/${order.orderId}`
                                                            )

                                                        }

                                                    >

                                                        مشاهده

                                                    </button>


                                                </td>





                                            </tr>

                                        );


                                    })
                                }



                            </tbody>


                        </table>

                    )
            }



        </div>

    );

}