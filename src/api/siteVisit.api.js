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



/* ===============================
   UPDATE SITE VISIT
================================ */

export const updateSiteVisit = ({ id, title, description, visitDateTime, locationNote }) => {
  return api.put(`/site-visits/${id}`, null, {
    params: {
      title,
      description,
      visitDateTime,
      locationNote,
    },
  });
};

/* ===============================
   ADD PHOTOS TO VISIT
================================ */
export const addVisitPhotos = (visitId, photos) => {
  const formData = new FormData();

  photos.forEach((photo) => {
    formData.append("photos", photo);
  });

  return api.post(`/site-visits/${visitId}/photos`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
/* ===============================
   ADD DOCUMENTS TO VISIT
================================ */
export const addVisitDocuments = (id, documents, documentNames = []) => {
  const formData = new FormData();

  documents.forEach((file) => {
    formData.append("documents", file);
  });

  if (documentNames.length) {
    documentNames.forEach((name) => {
      formData.append("documentNames", name);
    });
  }

  return api.post(`/site-visits/${id}/documents`, formData);
};
/* ===============================
   DELETE PHOTO FROM SITE VISIT
================================ */

export const deleteVisitPhoto = (visitId, photoId) => {
  return api.delete(`/site-visits/${visitId}/photos/${photoId}`);
};

/* ===============================
   DELETE DOCUMENT FROM SITE VISIT
================================ */

export const deleteVisitDocument = (visitId, documentId) => {
  return api.delete(`/site-visits/${visitId}/documents/${documentId}`);
};