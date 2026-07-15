import api from "./axios";

export const getResidentDashboard = async () => {
  const res = await api.get("/dashboard");
  return res.data.data;
};



export const getResidentCampaigns = async () => {
  const res = await api.get("/campaign/resident-campaigns");
  return res.data.campaigns;
};