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