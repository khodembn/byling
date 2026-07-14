import api from "./axios";


// دریافت پروفایل

export const getProfile = async () => {

    const res =
        await api.get("/user/profile");

    return res.data.data;

};




// ویرایش پروفایل

export const updateProfile = async (data) => {

    const res =
        await api.patch(
            "/user/profile",
            data
        );

    return res.data.date;

};




// حذف حساب

export const deleteAccount = async () => {

    const res =
        await api.delete(
            "/user/me"
        );

    return res.data;

};


export const getResidents = async () => {

    const res =
        await api.get("/user/residents");

    return res.data.data;

};



export const transferManager = async (
    newManagerUserId
) => {

    const res =
        await api.post(
            "/user/transfer-manager",
            {
                newManagerUserId
            }
        );


    return res.data;

};



export const getManagerPaymentInfo = async () => {

    const res =
        await api.get(
            "/user/manager/payment-info"
        );


    return res.data.data;

};



export const updateManagerPaymentInfo = async (
    data
) => {


    const res =
        await api.patch(
            "/user/manager/payment-info",
            data
        );


    return res.data.data;

};