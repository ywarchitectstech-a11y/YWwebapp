import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as meetingApi from "../meetings.api";

/* ===============================
   GET MEETINGS BY PROJECT
================================ */

export const useMeetingsByProject = (projectId) => {
  return useQuery({
    queryKey: ["meetings", projectId],
    queryFn: () =>
      meetingApi
        .getMeetingsByProject(projectId)
        .then((res) => res.data.data),
    enabled: !!projectId,
  });
};

/* ===============================
   GET SINGLE MEETING
================================ */

export const useMeetingById = (meetingId) => {
  return useQuery({
    queryKey: ["meeting", meetingId],
    queryFn: () =>
      meetingApi.getMeetingById(meetingId).then((res) => res.data.data),
    enabled: !!meetingId,
  });
};

/* ===============================
   CREATE MEETING
================================ */

export const useCreateMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, createdBy, meetingData }) =>
      meetingApi.createMeeting(projectId, createdBy, meetingData),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["meetings", variables.projectId],
      });
    },
  });
};

/* ===============================
   UPDATE MEETING
================================ */

export const useUpdateMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ meetingId, meetingData }) =>
      meetingApi.updateMeeting(meetingId, meetingData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
    },
  });
};

/* ===============================
   DELETE MEETING
================================ */

export const useDeleteMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (meetingId) => meetingApi.deleteMeeting(meetingId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
    },
  });
};