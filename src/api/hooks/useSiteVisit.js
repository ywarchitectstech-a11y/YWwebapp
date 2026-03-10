import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as siteVisitApi from "../siteVisit.api";

/* ===============================
   GET VISITS BY PROJECT
================================ */

export const useSiteVisits = (projectId) => {
  return useQuery({
    queryKey: ["siteVisits", projectId],
    queryFn: () =>
      siteVisitApi.getSiteVisitsByProject(projectId).then((res) => res.data.data),
    enabled: !!projectId,
  });
};

/* ===============================
   CREATE SITE VISIT
================================ */

export const useCreateSiteVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => siteVisitApi.createSiteVisit(data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["siteVisits", variables.projectId]);
    },
  });
};


/* ===============================
   DELETE SITE VISIT
================================ */

export const useDeleteSiteVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => siteVisitApi.deleteSiteVisit(id),

    onSuccess: () => {
      queryClient.invalidateQueries(["siteVisits"]);
    },
  });
};

/* ===============================
   UPDATE SITE VISIT
================================ */

export const useUpdateSiteVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => siteVisitApi.updateSiteVisit(data),

    onSuccess: () => {
      queryClient.invalidateQueries(["siteVisits"]);
    },
  });
};

/* ===============================
   ADD PHOTOS
================================ */

export const useAddVisitPhotos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, photos, photoCaptions }) =>
      siteVisitApi.addVisitPhotos(id, photos, photoCaptions),

    onSuccess: () => {
      queryClient.invalidateQueries(["siteVisits"]);
    },
  });
};

/* ===============================
   ADD DOCUMENTS
================================ */

export const useAddVisitDocuments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, documents, documentNames }) =>
      siteVisitApi.addVisitDocuments(id, documents, documentNames),

    onSuccess: () => {
      queryClient.invalidateQueries(["siteVisits"]);
    },
  });
};


/* ===============================
   DELETE PHOTO
================================ */

export const useDeleteVisitPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ visitId, photoId }) =>
      siteVisitApi.deleteVisitPhoto(visitId, photoId),

    onSuccess: () => {
      queryClient.invalidateQueries(["siteVisits"]);
    },
  });
};

/* ===============================
   DELETE DOCUMENT
================================ */

export const useDeleteVisitDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ visitId, documentId }) =>
      siteVisitApi.deleteVisitDocument(visitId, documentId),

    onSuccess: () => {
      queryClient.invalidateQueries(["siteVisits"]);
    },
  });
};