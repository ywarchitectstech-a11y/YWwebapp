import { useMutation } from "@tanstack/react-query";
import * as authApi from "../auth.api";

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }) =>
      authApi.login(email, password),
  });
};

export const useAdminLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }) =>
      authApi.adminLogin(email, password),
  });
};