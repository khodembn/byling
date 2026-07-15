//import { useNavigate } from "react-router-dom";

import "../../styles/Notifications.css";
export default function LatestNotificationModal({
    notification,
    onClose
}) {


    if (!notification) return null;

    return (

        <div
            className="notification-modal-overlay"
            onClick={onClose}
        >


            <div
                className="notification-modal"
                onClick={(e) => e.stopPropagation()}
            >


                <h2>
                    🔔 {notification.title}
                </h2>


                <p>
                    {notification.message}
                </p>



                <div className="modal-actions">

                    <button
                        type="button"
                        onClick={(e) => {

                            e.stopPropagation();

                            window.location.href =
                                "/resident/notifications";

                        }}
                    >
                        دیدن تمام اعلان‌ها
                    </button>



                    <button
                        type="button"
                        onClick={onClose}
                    >
                        بستن
                    </button>


                </div>


            </div>


        </div>

    );
}