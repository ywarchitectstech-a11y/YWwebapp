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