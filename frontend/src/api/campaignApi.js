import api from "./axios";

export const getCampaigns = async () => {
  const res = await api.get("/campaign");
  return res.data.campaigns;
};

export const getCampaignProducts = async (campaignId) => {
  const res = await api.get(`/campaign/${campaignId}/products`);
  return res.data.products;
};

export const createCampaign = async (data) => {
  const res = await api.post("/campaign", data);
  return res.data.campaign;
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

export const getCampaign = async (campaignId) => {

  const res = await api.get(`/campaign/${campaignId}`);

  return res.data.campaign;

};

export const requestPayment = async (
  campaignId,
  paymentDeadline
) => {
  const res = await api.patch(
    `/campaign/${campaignId}/request-payment`,
    {
      paymentDeadline
    }
  );

  return res.data;
};

export const checkPurchasing = async (campaignId) => {

  const res = await api.post(
    `/campaign/${campaignId}/check-purchasing`
  );

  return res.data.data;

};

export const startPurchasing = async (
  campaignId,
  managerMessage
) => {

  const res = await api.patch(
    `/campaign/${campaignId}/start-purchasing`,
    {
      managerMessage,
    }
  );

  return res.data;

};

export const cancelUnpaidOrders = async (
  campaignId
) => {

  const res = await api.patch(
    `/campaign/${campaignId}/cancel-unpaid-orders`
  );

  return res.data;

};

export const reopenCampaign = async (
  campaignId,
  paymentDeadline,
  message
) => {

  const res = await api.patch(
    `/campaign/${campaignId}/reopen`,
    {
      paymentDeadline,
      message,
    }
  );

  return res.data;

};

export const readyForDelivery = async (
  campaignId,
  message
) => {

  const res = await api.patch(
    `/campaign/${campaignId}/ready-for-delivery`,
    {
      message,
    }
  );

  return res.data;

};

export const completeCampaign = async (
  campaignId
) => {

  const res = await api.patch(
    `/campaign/${campaignId}/complete`
  );

  return res.data;

};