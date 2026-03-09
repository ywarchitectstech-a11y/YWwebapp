import axiosInstance from "./axiosInstance";

/* ===============================
   CREATE CLIENT
=============================== */

export const createClient = (data) =>
  axiosInstance.post("/clients/createclient", data);

/* ===============================
   GET ALL CLIENTS (BasicDTO)
=============================== */

export const getAllClients = () =>
  axiosInstance.get("/clients/getallclients");

/* ===============================
   GET CLIENT BY ID (Full DTO)
=============================== */

export const getClientById = (id) =>
  axiosInstance.get(`/clients/getclientbyid/${id}`);
// DELETE CLIENT
export const deleteClient = (id) =>
  axiosInstance.delete(`/clients/deleteclient/${id}`);
export const updateClient = (data) =>
  api.put("/clients/updateclient", data);
