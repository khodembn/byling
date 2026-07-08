import api from "./axios";

export const getResidentDashboard = async () => {
  const res = await api.get("/dashboard");
  return res.data.data;
};