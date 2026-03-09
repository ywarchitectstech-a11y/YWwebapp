import api from "./axiosInstance";

/* ===============================
   CREATE EMPLOYEE
=============================== */

export const createEmployee = (data) => {
  return api.post("/employees/createemployee", data);
};

/* ===============================
   GET MY EMPLOYEE DATA
=============================== */

export const getEmployeeData = () => {
  return api.get("/employees/getemployeedata");
};

/* ===============================
   UPDATE EMPLOYEE
=============================== */

export const updateEmployee = (id, data) => {
  return api.put(`/employees/updateemployee?id=${id}`, data);
};

/* ===============================
   UPDATE MY PROFILE
=============================== */

export const updateMyProfile = (data) => {
  return api.put("/employees/updatemyprofile", data);
};

/* ===============================
   DELETE EMPLOYEE
=============================== */

export const deleteEmployee = (id) => {
  return api.delete(`/employees/deleteemployee?id=${id}`);
};

/* ===============================
   GET ALL EMPLOYEES
=============================== */

export const getAllEmployees = () => {
  return api.get("/employees/getallemployees");
};


/* ===============================
   ACTIVATE EMPLOYEE
================================ */

export const activateEmployee = (id) => {
  return api.delete("/employees/activeemployee", {
    params: { id },
  });
};