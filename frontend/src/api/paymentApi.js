import api from "./axios";

export const uploadReceipt = async (orderId, formData) => {

    try {

        const res = await api.post(
            `/payment/upload-receipt/${orderId}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return res.data;

    } catch (error) {

        console.log(
            "UPLOAD RECEIPT ERROR:",
            error.response?.data
        );

        throw error;

    }

};



export const getMyPayments = async () => {

    const res = await api.get(
        "/payment/my-payments"
    );

    return res.data.data;

};

export const getManagerPayments = async () => {

    const res = await api.get("/payment/manager");

    return res.data.payments;

};

export const getPaymentDetails = async (paymentId) => {

    const res =
        await api.get(`/payment/${paymentId}`);

    return res.data.data;

};

export const approvePayment = async (paymentId) => {

    const res =
        await api.patch(
            `/payment/${paymentId}/approve`
        );

    return res.data;

};

export const rejectPayment = async (
    paymentId,
    rejectReason
) => {

    const res =
        await api.patch(
            `/payment/${paymentId}/reject`,
            {
                rejectReason,
            }
        );

    return res.data;

};