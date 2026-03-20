import api from "./axiosInstance";

/* =========================================
   PROFORMA INVOICE
========================================= */

// CREATE
export const createProforma = (postSalesId, data) => {
  return api.post(`/invoices/proforma/postsales/${postSalesId}`, data);
};

// GET BY ID
export const getProformaById = (id) => {
  return api.get(`/invoices/proforma/${id}`);
};

// GET BY POSTSALES
export const getProformasByPostSales = (postSalesId) => {
  return api.get(`/invoices/proforma/postsales/${postSalesId}`);
};

// UPDATE
export const updateProforma = (id, data) => {
  return api.put(`/invoices/proforma/${id}`, data);
};

// MARK SENT
export const markProformaSent = (id) => {
  return api.patch(`/invoices/proforma/${id}/send`);
};

// MARK PAID
export const markProformaPaid = (id) => {
  return api.patch(`/invoices/proforma/${id}/paid`);
};

// CONVERT → TAX INVOICE
export const convertToTaxInvoice = (proformaId) => {
  return api.post(`/invoices/proforma/${proformaId}/convert`);
};

// DELETE
export const deleteProforma = (id) => {
  return api.delete(`/invoices/proforma/${id}`);
};

/* =========================================
   TAX INVOICE
========================================= */

// CREATE
export const createTaxInvoice = (postSalesId, data) => {
  return api.post(`/invoices/tax/postsales/${postSalesId}`, data);
};

// GET BY ID
export const getTaxInvoiceById = (id) => {
  return api.get(`/invoices/tax/${id}`);
};

// GET BY POSTSALES
export const getTaxInvoicesByPostSales = (postSalesId) => {
  return api.get(`/invoices/tax/postsales/${postSalesId}`);
};

// MARK SENT
export const markTaxInvoiceSent = (id) => {
  return api.patch(`/invoices/tax/${id}/send`);
};

// MARK PAID
export const markTaxInvoicePaid = (id) => {
  return api.patch(`/invoices/tax/${id}/paid`);
};

// DELETE
export const deleteTaxInvoice = (id) => {
  return api.delete(`/invoices/tax/${id}`);
};

/* =========================================
   MAKE INVOICE PAID (CUSTOM)
   POST /api/invoices/makeinvoicepaid
========================================= */

export const makeInvoicePaid = (invoiceNumber, paymentData) => {
  return api.post("/invoices/makeinvoicepaid", paymentData, {
    params: {
      invoiceNumber,
    },
  });
};