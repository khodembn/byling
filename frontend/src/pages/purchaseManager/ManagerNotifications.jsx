import { useEffect, useState } from "react";

import {
    getMyNotifications,
    markNotificationAsRead
} from "../../api/notificationApi";


import "../../styles/Notifications.css";


const typeIcons = {

    PAYMENT_REQUEST: "💳",

    PAYMENT_APPROVED: "✅",

    PAYMENT_REJECTED: "❌",

    THRESHOLD_REACHED: "📦",

    REOPEN_THRESHOLD: "🔄",

    DELIVERY_READY: "🚚",

    CAMPAIGN_COMPLETED: "🎉",

    GENERAL: "🔔",

};



export default function ManagerNotifications() {


    const [notifications, setNotifications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);



    const fetchNotifications = async () => {

        try {

            const data =
                await getMyNotifications();


            setNotifications(data);


        }

        catch (err) {

            console.error(err);

            alert(
                "خطا در دریافت اعلان‌ها"
            );

        }

        finally {

            setLoading(false);

        }

    };




    useEffect(() => {

        fetchNotifications();

    }, []);





    const handleRead = async (id) => {


        try {


            await markNotificationAsRead(id);



            setNotifications(prev =>

                prev.map(item =>

                    item.notificationId === id

                        ?

                        {
                            ...item,
                            isRead: true
                        }

                        :

                        item

                )

            );


        }

        catch (err) {

            console.error(err);

            alert(
                "خطا در خواندن اعلان"
            );

        }

    };





    if (loading) {

        return (

            <h2>
                در حال دریافت اعلان‌ها...
            </h2>

        );

    }




    return (

        <div className="notifications-page">


            <h1>
                اعلان‌های مسئول خرید
            </h1>



            {
                notifications.length === 0

                    ?

                    (
                        <p>
                            اعلانی وجود ندارد.
                        </p>
                    )

                    :

                    (

                        <div className="notifications-list">


                            {
                                notifications.map(notification => (


                                    <div

                                        key={
                                            notification.notificationId
                                        }

                                        className={
                                            `notification-card ${notification.isRead
                                                ?
                                                "read"
                                                :
                                                "unread"
                                            }`
                                        }

                                    >



                                        <div className="notification-header">


                                            <h3>

                                                {
                                                    typeIcons[
                                                    notification.type
                                                    ]
                                                }

                                                {" "}

                                                {
                                                    notification.title
                                                }


                                            </h3>



                                            {
                                                !notification.isRead &&

                                                <span>
                                                    جدید
                                                </span>

                                            }


                                        </div>




                                        <p className="notification-message">

                                            {
                                                notification.message
                                            }

                                        </p>




                                        <div className="notification-footer">


                                            <small>

                                                {
                                                    new Date(
                                                        notification.createdAt
                                                    )
                                                        .toLocaleDateString(
                                                            "fa-IR"
                                                        )
                                                }

                                            </small>




                                            {
                                                !notification.isRead &&

                                                <button

                                                    onClick={() =>
                                                        handleRead(
                                                            notification.notificationId
                                                        )
                                                    }

                                                >

                                                    خواندم

                                                </button>

                                            }


                                        </div>


                                    </div>


                                ))
                            }


                        </div>

                    )
            }



        </div>

    );

}