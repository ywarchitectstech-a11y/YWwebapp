import { useMutation } from "@tanstack/react-query";
import { createStructure } from "../structure.api";

export const useCreateStructure = () => {
  return useMutation({
    mutationFn: ({ projectId, structure }) =>
      createStructure(projectId, structure),
  });
}; 