import api from "./axios";

export const getPurchaseDashboard = async () => {
  const res = await api.get("/dashboard/manager");

  console.log("API RESULT:", res.data);

  return res.data.data;
};