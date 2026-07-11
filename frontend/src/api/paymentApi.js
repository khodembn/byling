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