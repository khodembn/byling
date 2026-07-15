import api from "./axios";


export const getCampaignProducts = async (campaignId) => {

    const res = await api.get(
        `/campaign-product/${campaignId}`
    );

    return res.data.products;

};



export const addCampaignProduct = async (
    campaignId,
    productData
) => {

    const res = await api.post(
        `/campaign-product/${campaignId}`,
        productData
    );

    return res.data;

};



export const updateCampaignProduct = async (
    campaignId,
    campaignProductId,
    data
) => {

    const res = await api.patch(
        `/campaign-product/${campaignId}/${campaignProductId}`,
        data
    );

    return res.data;

};



export const deleteCampaignProduct = async (
    campaignId,
    campaignProductId
) => {

    const res = await api.delete(
        `/campaign-product/${campaignId}/${campaignProductId}`
    );

    return res.data;

};