import { useMutation, useQueryClient ,useQuery } from "@tanstack/react-query";
import * as postSalesApi from "../postsales.api";

export const useCreatePostSales = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => postSalesApi.createPostSales(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["postsales"]);
    },
  });
};
export const useConvertToPostSales = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preSalesId) =>
      postSalesApi.convertToPostSales(preSalesId),

    onSuccess: () => {
      queryClient.invalidateQueries(["presales"]);
      queryClient.invalidateQueries(["postsales"]);
    },
  });
};

// Get All PostSales
export const usePostSalesList = (
  page,
  size = 10
) => {
  return useQuery({
    queryKey: ["postsales", page],
    queryFn: async () => {
      const res =
        await postSalesApi.getAllPostSales(
          page,
          size
        );
      return res.data.data;
    },
    keepPreviousData: true,
  });
};

// Get Detailed PostSales
export const usePostSalesById = (id) => {
  return useQuery({
    queryKey: ["postsales", id],
    queryFn: async () => {
      const res =
        await postSalesApi.getPostSalesById(id);
    return res.data.data|| null;
    },
    enabled: !!id,
  });
};
export const usePostSalesByClient = (
  clientId,
  page,
  size,
  options = {}
) => {
  return useQuery({
    queryKey: ["postSalesClient", clientId, page, size],
    queryFn: () =>
      postSalesApi
        .getPostSalesByClient(clientId, page, size)
        .then((res) => res.data.data),
    enabled: !!clientId,
    ...options,
  });
};