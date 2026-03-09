import api from "./axiosInstance";

/* ===============================
   CREATE SITE VISIT
================================ */

export const createSiteVisit = (data) => {
  const formData = new FormData();

  formData.append("projectId", data.projectId);
  formData.append("title", data.title);

  if (data.description) formData.append("description", data.description);
  if (data.locationNote) formData.append("locationNote", data.locationNote);
  if (data.visitDateTime) formData.append("visitDateTime", data.visitDateTime);

  /* Photos */
  data.photos?.forEach((photo) => {
    formData.append("photos", photo);
  });

  data.photoCaptions?.forEach((caption) => {
    formData.append("photoCaptions", caption);
  });

  /* Documents */
  data.documents?.forEach((doc) => {
    formData.append("documents", doc);
  });

  data.documentNames?.forEach((name) => {
    formData.append("documentNames", name);
  });

  return api.post("/site-visits", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* ===============================
   GET VISITS BY PROJECT
================================ */

export const getSiteVisitsByProject = (projectId) => {
  return api.get(`/site-visits/project/${projectId}`);
};

/* ===============================
   GET VISIT BY ID
================================ */

export const getSiteVisitById = (id) => {
  return api.get(`/site-visits/${id}`);
};

/* ===============================
   DELETE SITE VISIT
================================ */

export const deleteSiteVisit = (id) => {
  return api.delete(`/site-visits/${id}`);
};