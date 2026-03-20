// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import * as invoiceApi from "../invoice.api";

// /* ===============================
//    GET PROFORMAS BY POSTSALES
// ================================ */

// export const useProformas = (postSalesId) => {
//   return useQuery({
//     queryKey: ["proformas", postSalesId],
//     queryFn: () =>
//       invoiceApi
//         .getProformasByPostSales(postSalesId)
//         .then((res) => res.data.data),
//     enabled: !!postSalesId,
//   });
// };

// /* ===============================
//    CREATE PROFORMA
// ================================ */

// export const useCreateProforma = () => {
//   const qc = useQueryClient();

//   return useMutation({
//     mutationFn: ({ postSalesId, data }) =>
//       invoiceApi.createProforma(postSalesId, data),

//     onSuccess: (_, variables) => {
//       qc.invalidateQueries({
//         queryKey: ["proformas", variables.postSalesId],
//       });
//     },
//   });
// };

// /* ===============================
//    CONVERT TO TAX INVOICE
// ================================ */

// export const useConvertToTax = () => {
//   const qc = useQueryClient();

//   return useMutation({
//     mutationFn: (proformaId) =>
//       invoiceApi.convertToTaxInvoice(proformaId),

//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ["taxInvoices"] });
//     },
//   });
// };

// /* ===============================
//    GET TAX INVOICES
// ================================ */

// export const useTaxInvoices = (postSalesId) => {
//   return useQuery({
//     queryKey: ["taxInvoices", postSalesId],
//     queryFn: () =>
//       invoiceApi
//         .getTaxInvoicesByPostSales(postSalesId)
//         .then((res) => res.data.data),
//     enabled: !!postSalesId,
//   });
// };

// /* ===============================
//    MARK TAX INVOICE PAID
// ================================ */

// export const useMarkInvoicePaid = () => {
//   const qc = useQueryClient();

//   return useMutation({
//     mutationFn: ({ invoiceNumber, paymentData }) =>
//       invoiceApi.makeInvoicePaid(invoiceNumber, paymentData),

//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ["taxInvoices"] });
//     },
//   });
// };
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as invoiceApi from "../invoice.api";

const PROFORMA_KEY = "proformaInvoices";
const TAX_KEY      = "taxInvoices";

// ═══════════════════════════════════════════════════════
// PROFORMA INVOICE HOOKS
// ═══════════════════════════════════════════════════════

// GET all proformas for a post-sales record
export const useProformasByPostSales = (postSalesId) => {
  return useQuery({
    queryKey: [PROFORMA_KEY, postSalesId],
    queryFn: () =>
      invoiceApi
        .getProformasByPostSales(postSalesId)
        .then((res) => res.data.data),
    enabled: !!postSalesId,
  });
};

// GET single proforma by id
export const useProformaById = (id) => {
  return useQuery({
    queryKey: [PROFORMA_KEY, "single", id],
    queryFn: () =>
      invoiceApi.getProformaById(id).then((res) => res.data.data),
    enabled: !!id,
  });
};

// CREATE proforma
export const useCreateProforma = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postSalesId, data }) =>
      invoiceApi.createProforma(postSalesId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [PROFORMA_KEY, variables.postSalesId] });
    },
  });
};

// UPDATE proforma
export const useUpdateProforma = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => invoiceApi.updateProforma(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROFORMA_KEY] });
    },
  });
};

// MARK SENT
export const useMarkProformaSent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => invoiceApi.markProformaSent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROFORMA_KEY] });
    },
  });
};

// MARK PAID
export const useMarkProformaPaid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => invoiceApi.markProformaPaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROFORMA_KEY] });
    },
  });
};

// CONVERT → TAX INVOICE
export const useConvertToTaxInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (proformaId) => invoiceApi.convertToTaxInvoice(proformaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROFORMA_KEY] });
      queryClient.invalidateQueries({ queryKey: [TAX_KEY] });
    },
  });
};

// DELETE proforma
export const useDeleteProforma = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => invoiceApi.deleteProforma(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROFORMA_KEY] });
    },
  });
};

// ═══════════════════════════════════════════════════════
// TAX INVOICE HOOKS
// ═══════════════════════════════════════════════════════

// GET all tax invoices for a post-sales record
export const useTaxInvoicesByPostSales = (postSalesId) => {
  return useQuery({
    queryKey: [TAX_KEY, postSalesId],
    queryFn: () =>
      invoiceApi
        .getTaxInvoicesByPostSales(postSalesId)
        .then((res) => res.data.data),
    enabled: !!postSalesId,
  });
};

// GET single tax invoice by id
export const useTaxInvoiceById = (id) => {
  return useQuery({
    queryKey: [TAX_KEY, "single", id],
    queryFn: () =>
      invoiceApi.getTaxInvoiceById(id).then((res) => res.data.data),
    enabled: !!id,
  });
};

// CREATE tax invoice
export const useCreateTaxInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postSalesId, data }) =>
      invoiceApi.createTaxInvoice(postSalesId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [TAX_KEY, variables.postSalesId] });
    },
  });
};

// MARK TAX SENT
export const useMarkTaxInvoiceSent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => invoiceApi.markTaxInvoiceSent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TAX_KEY] });
    },
  });
};

// MARK TAX PAID
export const useMarkTaxInvoicePaid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => invoiceApi.markTaxInvoicePaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TAX_KEY] });
    },
  });
};

// DELETE tax invoice
export const useDeleteTaxInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => invoiceApi.deleteTaxInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TAX_KEY] });
    },
  });
};

// MAKE INVOICE PAID (custom payment recording)
export const useMakeInvoicePaid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ invoiceNumber, paymentData }) =>
      invoiceApi.makeInvoicePaid(invoiceNumber, paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TAX_KEY] });
    },
  });
};