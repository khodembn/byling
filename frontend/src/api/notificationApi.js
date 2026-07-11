import api from "./axios";


export const getMyNotifications = async () => {

    const res = await api.get(
        "/notifications/my"
    );

    return res.data.data;

};



export const markNotificationAsRead = async (notificationId) => {

    const res = await api.patch(
        `/notifications/${notificationId}/read`
    );

    return res.data.data;

};