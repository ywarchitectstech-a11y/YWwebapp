import api from "./axiosInstance";

// ── CREATE QUOTATION ─────────────────────────────
// POST /api/quotations/presales/{preSalesId}
export const createQuotation = (preSalesId, quotation) => {
  return api.post(`/quotations/presales/${preSalesId}`, quotation);
};

// ── GET BY ID ────────────────────────────────────
// GET /api/quotations/{id}
export const getQuotationById = (id) => {
  return api.get(`/quotations/${id}`);
};

// ── GET BY PRESALES ──────────────────────────────
// GET /api/quotations/presales/{preSalesId}
export const getQuotationsByPreSales = (preSalesId) => {
  return api.get(`/quotations/presales/${preSalesId}`);
};

// ── GET ALL QUOTATIONS ───────────────────────────
// GET /api/quotations/all
export const getAllQuotations = () => {
  return api.get(`/quotations/all`);
};

// ── UPDATE QUOTATION ─────────────────────────────
// PUT /api/quotations/{id}
export const updateQuotation = (id, quotation) => {
  return api.put(`/quotations/${id}`, quotation);
};

// ── MARK AS SENT ─────────────────────────────────
// PATCH /api/quotations/{id}/send
export const markQuotationSent = (id) => {
  return api.patch(`/quotations/${id}/send`);
};


/* ===============================
   MARK QUOTATION AS ACCEPTED
   PATCH /api/quotations/{id}/accept
================================ */

export const acceptQuotation = (id) => {
  return api.patch(`/quotations/${id}/accept`);
};

/* ===============================
   DELETE QUOTATION
   DELETE /api/quotations/{id}
================================ */

export const deleteQuotation = (id) => {
  return api.delete(`/quotations/${id}`);
};