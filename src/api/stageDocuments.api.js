import api from "./axiosInstance";

/* =====================================================
   ADD DOCUMENT
   POST /api/stages/{stageId}/documents/addDocument/{documentName}
===================================================== */

export const addStageDocument = (stageId, documentName, documentType, file) => {
  const formData = new FormData();

  formData.append("document", file);

  return api.post(
    `/stages/${stageId}/documents/addDocument/${documentName}/${documentType}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};


/* =====================================================
   UPDATE DOCUMENT
   PUT /api/stages/{stageId}/documents/updateDocument/{documentId}
===================================================== */

export const updateStageDocument = (stageId, documentId, file) => {
  const formData = new FormData();
  formData.append("document", file);

  return api.put(
    `/stages/${stageId}/documents/updateDocument/${documentId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};


/* =====================================================
   DELETE DOCUMENT
   DELETE /api/stages/{stageId}/documents/deletedocument/{documentFilePath}
===================================================== */

export const deleteStageDocument = (stageId, documentFilePath) => {
  return api.delete(
    `/stages/${stageId}/documents/deletedocument/${documentFilePath}`
  );
};