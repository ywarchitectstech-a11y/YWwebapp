import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as attendanceApi from "../attendance.api";

/* ===============================
   MY CHECK-IN
=============================== */
export const useMyCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ date, time }) =>
      attendanceApi.recordMyCheckIn(date, time),

    onSuccess: () => {
      queryClient.invalidateQueries(["myAttendance"]);
    },
  });
};

/* ===============================
   HR CHECK-IN
=============================== */
export const useCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, date, time }) =>
      attendanceApi.recordCheckIn(userId, date, time),

    onSuccess: () => {
      queryClient.invalidateQueries(["attendance"]);
    },
  });
};

/* ===============================
   HR CHECK-OUT
=============================== */
export const useCheckOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, date, time, attendanceStatus }) =>
      attendanceApi.recordCheckOut(
        userId,
        date,
        time,
        attendanceStatus
      ),

    onSuccess: () => {
      queryClient.invalidateQueries(["attendance"]);
    },
  });
};

/* ===============================
   SINGLE ATTENDANCE
=============================== */
export const useSingleAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ date, data }) =>
      attendanceApi.markSingleAttendance(date, data),

    onSuccess: () => {
      queryClient.invalidateQueries(["attendance"]);
    },
  });
};

/* ===============================
   BULK ATTENDANCE
=============================== */
export const useBulkAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ date, data }) =>
      attendanceApi.markBulkAttendance(date, data),

    onSuccess: () => {
      queryClient.invalidateQueries(["attendance"]);
    },
  });
};

/* ===============================
   USER MONTHLY
=============================== */
export const useUserMonthlyAttendance = (userId, month, year) => {
  return useQuery({
    queryKey: ["attendance", userId, month, year],
    queryFn: () =>
      attendanceApi
        .getMonthlyAttendance(userId, month, year)
        .then((res) => res.data.data),
    enabled: !!userId,
  });
};

/* ===============================
   ALL EMPLOYEES MONTHLY
=============================== */
export const useAllEmployeesAttendance = (month, year) => {
  return useQuery({
    queryKey: ["allAttendance", month, year],
    queryFn: () =>
      attendanceApi
        .getAllEmployeesMonthlyAttendance(month, year)
        .then((res) => res.data.data),
  });
};

/* ===============================
   MY MONTHLY
=============================== */
export const useMyMonthlyAttendance = (month, year) => {
  return useQuery({
    queryKey: ["myAttendance", month, year],
    queryFn: () =>
      attendanceApi
        .getMyMonthlyAttendance(month, year)
        .then((res) => res.data.data),
  });
};