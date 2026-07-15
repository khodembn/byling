import api from "./axios";
export const getMyOrder = async (campaignId) => {

    const res = await api.get(
        `/order/my-order/${campaignId}`
    );

    return res.data.data;

};

export const createOrUpdateOrder = async (data) => {
    const res = await api.post("/order", data);
    return res.data;
};

export const getCart = async () => {
    const res = await api.get("/order/cart");

    return res.data.data;
};


export const getOrderPreview = async (campaignId) => {

    const res = await api.get(
        `/order/preview/${campaignId}`
    );

    return res.data.data;

};

export const submitOrderApi = async (orderId) => {

    const res = await api.post(
        `/order/${orderId}/submit`
    );

    return res.data;

};




export const getMyOrders = async () => {

    const res = await api.get("/order/my-orders");

    return res.data.data;

};



export const cancelOrder = async (orderId) => {

    const res = await api.delete(`/order/${orderId}/cancel`);

    return res.data;

};

export const getManagerOrders = async () => {

    const res = await api.get("/order/manager");

    return res.data.orders;

};

export const getManagerOrderDetails = async (orderId) => {

    const res = await api.get(
        `/order/manager/${orderId}`
    );

    return res.data.data;

};
