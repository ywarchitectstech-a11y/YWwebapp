import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as quotationApi from "../quotation.api";

const QUERY_KEY = "quotations";

// ── GET ALL ──────────────────────────────────────
export const useAllQuotations = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () =>
      quotationApi.getAllQuotations().then((res) => res.data.data),
  });
};

// ── GET BY PRESALES ──────────────────────────────
export const useQuotationsByPreSale = (preSalesId) => {
  return useQuery({
    queryKey: [QUERY_KEY, "presales", preSalesId],
    queryFn: () =>
      quotationApi
        .getQuotationsByPreSales(preSalesId)
        .then((res) => res.data.data),
    enabled: !!preSalesId,
  });
};

// ── GET BY ID ────────────────────────────────────
export const useQuotation = (id) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () =>
      quotationApi.getQuotationById(id).then((res) => res.data.data),
    enabled: !!id,
  });
};

// ── CREATE ───────────────────────────────────────
export const useCreateQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ preSalesId, quotation }) =>
      quotationApi.createQuotation(preSalesId, quotation),

    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
    },
  });
};

// ── UPDATE ───────────────────────────────────────
export const useUpdateQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quotation }) =>
      quotationApi.updateQuotation(id, quotation),

    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
    },
  });
};

// ── MARK SENT ────────────────────────────────────
export const useMarkQuotationSent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => quotationApi.markQuotationSent(id),

    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
    },
  });
};

// ── MARK ACCEPTED ────────────────────────────────
export const useMarkQuotationAccepted = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => quotationApi.markQuotationAccepted(id),

    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
    },
  });
};

// ── DELETE ───────────────────────────────────────
export const useDeleteQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => quotationApi.deleteQuotation(id),

    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
    },
  });
};