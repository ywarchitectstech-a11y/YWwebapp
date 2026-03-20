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
/* ===============================
   UPDATE CLIENT
=============================== */
export const updateClient = (id, data) =>
  api.put("/clients/updateclient", data, {
    params: { id },
  });
// ── GET CLIENT PROFILE ─────────────────────────
export const getClientProfile = () => {
  return api.get("/clients/getclient");
};
/* ===============================
   UPDATE MY PASSWORD
=============================== */
export const updateMyPassword = (oldPassword, newPassword) =>
  api.put("/clients/updatemypassword", null, {
    params: { oldPassword, newPassword },
  });