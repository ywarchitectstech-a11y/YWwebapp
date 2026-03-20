import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as employeeApi from "../employee.api";

/* ===============================
   GET ALL EMPLOYEES
=============================== */

export const useEmployeeList = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: () =>
      employeeApi.getAllEmployees().then((res) => res.data.data),
  });
};

/* ===============================
   GET MY PROFILE
=============================== */

export const useEmployeeData = () => {
  return useQuery({
    queryKey: ["employeeData"],
    queryFn: () =>
      employeeApi.getEmployeeData().then((res) => res.data.data),
  });
};

/* ===============================
   CREATE EMPLOYEE
=============================== */

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => employeeApi.createEmployee(data),

    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
    },
  });
};

/* ===============================
   UPDATE EMPLOYEE
=============================== */

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => employeeApi.updateEmployee(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
    },
  });
};
export const useEmployeeById = (id) => {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: async () => {
      const res = await employeeApi.getAllEmployees();
      const employees = res.data.data;

      return employees.find((emp) => emp.id === Number(id));
    },
    enabled: !!id,
  });
};
/* ===============================
   UPDATE MY PROFILE
=============================== */

export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => employeeApi.updateMyProfile(data),

    onSuccess: () => {
      queryClient.invalidateQueries(["employeeData"]);
    },
  });
};

/* ===============================
   DELETE EMPLOYEE
=============================== */

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => employeeApi.deleteEmployee(id),

    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
    },
  });
};

/* ===============================
   ACTIVATE EMPLOYEE
=============================== */

export const useActivateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => employeeApi.activateEmployee(id),

    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
    },
  });
};


/* ===============================
   UPDATE MY PASSWORD
=============================== */
export const useUpdateMyPassword = () => {
  return useMutation({
    mutationFn: ({ oldPassword, newPassword }) =>
      employeeApi.updateMyPassword(oldPassword, newPassword),
  });
};


/* ===============================
   UPDATE PROFILE IMAGE
=============================== */
export const useUpdateMyProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file) => employeeApi.updateMyProfileImage(file),

    onSuccess: () => {
      // refresh user profile everywhere
      queryClient.invalidateQueries(["userProfile"]);
    },
  });
};