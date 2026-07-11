import api from "./axios";

export const getProducts = async () => {
  const res = await api.get("/product");
  return res.data.products;
};