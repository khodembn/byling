import { useEffect, useState } from "react";

import {
    getMyNotifications,
    markNotificationAsRead
} from "../api/notificationApi";


export default function useLatestNotification() {

    console.log("Hook executed");
    const [
        latestNotification,
        setLatestNotification
    ] = useState(null);



    useEffect(() => {


        const fetchNotification = async () => {


            try {


                const data =
                    await getMyNotifications();



                const unread =
                    data.find(
                        item =>
                            item.isRead === false
                    );



                if (unread) {


                    setLatestNotification(unread);



                    // بعد از نمایش، خوانده شود
                    await markNotificationAsRead(
                        unread.notificationId
                    );


                }



            } catch (error) {

                console.log(error);

            }


        };



        fetchNotification();


    }, []);



    return {

        latestNotification,


        closeNotification: () => {

            setLatestNotification(null);

        }

    };

}