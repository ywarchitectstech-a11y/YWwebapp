import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as stageDocApi from "../stageDocuments.api";
import axios from "axios";

/* =====================================================
   ADD DOCUMENT
===================================================== */

export function useAddStageDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ stageId, documentName, documentType, file }) =>
      stageDocApi.addStageDocument(stageId, documentName, documentType, file),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["stage", variables.stageId]);
    },

    onError: (err) => {
      console.error("Upload Error:", err);
      alert("Document upload failed");
    },
  });
}
/* =====================================================
   UPDATE DOCUMENT
===================================================== */

export const useUpdateStageDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ stageId, documentId, file }) =>
      stageDocApi.updateStageDocument(stageId, documentId, file),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["stage", variables.stageId]);
    },
  });
};


/* =====================================================
   DELETE DOCUMENT
===================================================== */

export const useDeleteStageDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ stageId, documentFilePath }) =>
      stageDocApi.deleteStageDocument(stageId, documentFilePath),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["stage", variables.stageId]);
    },
  });
};