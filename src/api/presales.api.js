// api/presales.api.js
import axiosInstance from "./axiosInstance";

export const createPreSales = (data, existingClient) =>
  axiosInstance.post(
    `/presales/create?existingClient=${existingClient}`,
    data
  );

export const getAllPreSales = () =>
  axiosInstance.get("/presales/getall");

export const updatePreSales = (data) =>
  axiosInstance.put("/presales/update", data);

export const deletePreSales = (srNumber) =>
  axiosInstance.delete(`/presales/delete/${srNumber}`);

