import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as clientApi from "../client.api";

/* ===============================
   GET ALL CLIENTS
=============================== */

export const useClientList = () => {
  return useQuery({
    queryKey: ["clients"],
    queryFn: () =>
      clientApi.getAllClients().then((res) => res.data.data),
  });
};

/* ===============================
   GET CLIENT BY ID
=============================== */

export const useClientById = (id) => {
  return useQuery({
    queryKey: ["client", id],
    queryFn: () =>
      clientApi.getClientById(id).then((res) => res.data.data),
    enabled: !!id,
  });
};

/* ===============================
   CREATE CLIENT
=============================== */

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => clientApi.createClient(data),

    onSuccess: () => {
      queryClient.invalidateQueries(["clients"]);
    },
  });
};
export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => clientApi.deleteClient(id),

    onSuccess: () => {
      queryClient.invalidateQueries(["clients"]);
    },
  });
};
export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => clientApi.updateClient(data),

    onSuccess: () => {
      queryClient.invalidateQueries(["clients"]);
    },
  });
};


export const useClientProfile = () => {
  return useQuery({
    queryKey: ["clientProfile"],
    queryFn: () =>
      clientApi.getClientProfile().then((res) => res.data.data),
  });
};