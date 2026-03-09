import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../presales.api";

export const usePreSalesList = () => {
  return useQuery({
    queryKey: ["presales"],
    queryFn: () => api.getAllPreSales().then(res => res.data.data)
    
  });
};

export const useCreatePreSales = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, existingClient }) =>
      api.createPreSales(data, existingClient),

    onSuccess: () => {
      queryClient.invalidateQueries(["presales"]);
    }
  });
};

export const useDeletePreSales = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (srNumber) =>
      api.deletePreSales(srNumber),

    onSuccess: () => {
      queryClient.invalidateQueries(["presales"]);
    }
  });
};

export const useUpdatePreSales = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      api.updatePreSales(data),

    onSuccess: () => {
      queryClient.invalidateQueries(["presales"]);
    }
  });
};
export const useUpdatePreSalesStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ srNumber, status }) =>
     api.updatePreSalesStatus(srNumber,status),

    onSuccess: () => {
      queryClient.invalidateQueries(["presales"]);
    },
  });
};
