import axiosInstance from "./axiosInstance";

export const createPostSales = (data) =>
  axiosInstance.post("/postsales/createpostSales", data);
export const convertToPostSales = (preSalesId) =>
  axiosInstance.post(
    `/postsales/converttopostSales?preSalesId=${preSalesId}`
  );
  // Get All PostSales

export const getAllPostSales = (page = 0, size = 10) =>
  axiosInstance.get(
    `/postsales/getall?page=${page}&size=${size}`
  );
 

export const getPostSalesById = (id) =>
  axiosInstance.get(`/postsales/${id}`);

export const getPostSalesByClient = (clientId, page = 0, size = 10) => {
  return axiosInstance.get(`/postsales/client/${clientId}`, {
    params: { page, size },
  });
};