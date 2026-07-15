import { useEffect, useState } from "react";

import {
    getMyNotifications,
    markNotificationAsRead
} from "../../api/notificationApi";



const typeIcons = {

    PAYMENT_REQUEST: "💳",

    PAYMENT_APPROVED: "✅",

    REOPEN_THRESHOLD: "🔄",

    GENERAL: "🔔",

};



export default function ResidentNotifications() {


    const [notifications, setNotifications] = useState([]);

    const [loading, setLoading] = useState(true);



    const fetchNotifications = async () => {

        try {

            const data = await getMyNotifications();

            setNotifications(data);


        } catch (error) {

            console.error(error);

            alert(
                "خطا در دریافت اعلان‌ها"
            );

        } finally {

            setLoading(false);

        }

    };




    useEffect(() => {

        fetchNotifications();

    }, []);





    const handleRead = async (notificationId) => {


        try {


            const updated =
                await markNotificationAsRead(
                    notificationId
                );


            setNotifications(prev =>

                prev.map(item =>

                    item.notificationId === notificationId

                        ?

                        {
                            ...item,
                            isRead: true
                        }

                        :

                        item

                )

            );


        } catch (error) {

            console.error(error);

            alert(
                "خطا در خواندن اعلان"
            );

        }


    };





    if (loading) {

        return (

            <div>

                در حال دریافت اعلان‌ها...

            </div>

        );

    }







    return (

        <div className="notifications-page">


            <h1>
                اعلان‌های من
            </h1>



            {
                notifications.length === 0

                    ?

                    <p>
                        اعلانی وجود ندارد.
                    </p>


                    :


                    <div className="notifications-list">


                        {
                            notifications.map(notification => (


                                <div

                                    key={
                                        notification.notificationId
                                    }

                                    className={

                                        `notification-card 
                                    ${notification.isRead
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
                                            !notification.isRead && (

                                                <span>

                                                    جدید

                                                </span>

                                            )
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
                                            !notification.isRead && (

                                                <button

                                                    onClick={() =>

                                                        handleRead(
                                                            notification.notificationId
                                                        )

                                                    }

                                                >

                                                    خواندم

                                                </button>

                                            )
                                        }



                                    </div>



                                </div>



                            ))
                        }


                    </div>

            }



        </div>

    );

}