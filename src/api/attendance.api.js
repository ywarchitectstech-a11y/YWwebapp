import api from "./axiosInstance";

/* ===============================
   USER CHECK-IN (SELF)
=============================== */
export const recordMyCheckIn = (date, time) =>
  api.patch("/attendance/recordmycheckIn", null, {
    params: { date, time },
  });

/* ===============================
   HR CHECK-IN
=============================== */
export const recordCheckIn = (userId, date, time) =>
  api.patch(`/attendance/${userId}/checkin`, null, {
    params: { date, time },
  });

/* ===============================
   HR CHECK-OUT
=============================== */
export const recordCheckOut = (userId, date, time, attendanceStatus) =>
  api.patch(`/attendance/${userId}/checkout`, null, {
    params: { date, time, attendanceStatus },
  });

/* ===============================
   SINGLE ATTENDANCE
=============================== */
export const markSingleAttendance = (date, data) =>
  api.post("/attendance/single", data, {
    params: { date },
  });

/* ===============================
   BULK ATTENDANCE
=============================== */
export const markBulkAttendance = (date, data) =>
  api.post("/attendance/bulk", data, {
    params: { date },
  });

/* ===============================
   GET USER MONTHLY
=============================== */
export const getMonthlyAttendance = (userId, month, year) =>
  api.get(`/attendance/${userId}`, {
    params: { month, year },
  });

/* ===============================
   GET ALL EMPLOYEES MONTHLY
=============================== */
export const getAllEmployeesMonthlyAttendance = (month, year) =>
  api.get("/attendance/all", {
    params: { month, year },
  });

/* ===============================
   GET MY ATTENDANCE
=============================== */
export const getMyMonthlyAttendance = (month, year) =>
  api.get("/attendance/getmymonthlyattendance", {
    params: { month, year },
  });