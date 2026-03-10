import { useMutation, useQueryClient ,useQuery} from "@tanstack/react-query";
import * as projectApi from "../project.api";

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      projectApi.createProject(data),

    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
    },
  });
};

export const useProjectById = (projectId) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const res =
        await projectApi.getProjectById(projectId);
      return res?.data ?? null;
    },
    enabled: !!projectId,
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      projectData,
      logoFile,
    }) =>
      projectApi.updateProject(
        projectId,
        projectData,
        logoFile
      ),

    onSuccess: (_, variables) => {
      // Refetch project details after update
      queryClient.invalidateQueries([
        "project",
        variables.projectId,
      ]);

      // If you have project list page
      queryClient.invalidateQueries(["projects"]);
    },
  });
};

export const useUpdateProjectStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, status }) =>
      projectApi.updateProjectStatus(
        projectId,
        status
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries([
        "project",
        variables.projectId,
      ]);
    },
  });
};
/* ===============================
   GET ALL PROJECTS (PAGINATION)
================================ */

export const useProjectList = (page, size) => {
  return useQuery({
    queryKey: ["projects", page, size],
    queryFn: () =>
      projectApi.getAllProjects(page, size).then((res) => res.data.data),
  });
};


/* ===============================
   ADD USERS TO PROJECT
================================ */

export const useAddUsersToProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, userIds }) =>
      projectApi.addUsersToProject(projectId, userIds),

    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
    },
  });
};