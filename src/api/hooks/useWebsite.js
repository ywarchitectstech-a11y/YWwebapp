// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { websiteApi } from "../website.api";

// /* ===============================
//    GET ALL PROJECTS
// =============================== */
// export const useAllProjects = () => {
//   return useQuery({
//     queryKey: ["websiteProjects"],
//     queryFn: () =>
//       websiteApi.getAllProjects().then((res) => res.data),
//   });
// };

// /* ===============================
//    GET BY SLUG
// =============================== */
// export const useProjectBySlug = (slug) => {
//   return useQuery({
//     queryKey: ["websiteProject", slug],
//     queryFn: () =>
//       websiteApi.getProjectBySlug(slug).then((res) => res.data),
//     enabled: !!slug,
//   });
// };

// /* ===============================
//    GET BY ID
// =============================== */
// export const useProjectById = (id) => {
//   return useQuery({
//     queryKey: ["websiteProjectId", id],
//     queryFn: () =>
//       websiteApi.getProjectById(id).then((res) => res.data),
//     enabled: !!id,
//   });
// };

// /* ===============================
//    CREATE PROJECT
// =============================== */
// export const useCreateProject = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (formData) => websiteApi.createProject(formData),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["websiteProjects"]);
//     },
//   });
// };

// /* ===============================
//    UPDATE DETAILS
// =============================== */
// export const useUpdateProjectDetails = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ id, data }) =>
//       websiteApi.updateProjectDetails(id, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["websiteProjects"]);
//     },
//   });
// };

// /* ===============================
//    DELETE PROJECT
// =============================== */
// export const useDeleteProject = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (id) => websiteApi.deleteProject(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["websiteProjects"]);
//     },
//   });
// };
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { websiteApi } from "../website.api";

// ─── Helpers ──────────────────────────────────────────────────────────────────
// Invalidate both the single-project cache and the full list
const useProjectInvalidate = () => {
  const queryClient = useQueryClient();
  return (id) => {
    queryClient.invalidateQueries({ queryKey: ["websiteProjectId", id] });
    queryClient.invalidateQueries({ queryKey: ["websiteProjects"] });
  };
};

/* =============================================================================
   QUERIES
============================================================================= */

// GET ALL PROJECTS
export const useAllProjects = () =>
  useQuery({
    queryKey: ["websiteProjects"],
    queryFn: () => websiteApi.getAllProjects().then((res) => res.data),
  });

// GET BY SLUG (public)
export const useProjectBySlug = (slug) =>
  useQuery({
    queryKey: ["websiteProject", slug],
    queryFn: () => websiteApi.getProjectBySlug(slug).then((res) => res.data),
    enabled: !!slug,
  });

// GET BY ID (admin)
export const useProjectById = (id) =>
  useQuery({
    queryKey: ["websiteProjectId", id],
    queryFn: () => websiteApi.getProjectById(id).then((res) => res.data),
    enabled: !!id,
  });

/* =============================================================================
   MUTATIONS — Project CRUD
============================================================================= */

// CREATE PROJECT (multipart)
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => websiteApi.createProject(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["websiteProjects"] });
    },
  });
};

// UPDATE DETAILS (JSON)
export const useUpdateProjectDetails = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => websiteApi.updateProjectDetails(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["websiteProjectId", id] });
      queryClient.invalidateQueries({ queryKey: ["websiteProjects"] });
    },
  });
};

// DELETE PROJECT
export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => websiteApi.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["websiteProjects"] });
    },
  });
};

/* =============================================================================
   MUTATIONS — Single Image Updates (multipart, one file each)
   Each builds its own FormData with the exact @RequestPart key the backend needs
============================================================================= */

// HERO IMAGE  →  @RequestPart("heroImage")
export const useUpdateHeroImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }) => {
      const fd = new FormData();
      fd.append("heroImage", file);
      return websiteApi.updateHeroImage(id, fd);
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["websiteProjectId", id] });
      queryClient.invalidateQueries({ queryKey: ["websiteProjects"] });
    },
  });
};

// FULL IMAGE  →  @RequestPart("fullImage")
export const useUpdateFullImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }) => {
      const fd = new FormData();
      fd.append("fullImage", file);
      return websiteApi.updateFullImage(id, fd);
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["websiteProjectId", id] });
      queryClient.invalidateQueries({ queryKey: ["websiteProjects"] });
    },
  });
};

// LEFT IMAGE  →  @RequestPart("leftImage")
export const useUpdateLeftImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }) => {
      const fd = new FormData();
      fd.append("leftImage", file);
      return websiteApi.updateLeftImage(id, fd);
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["websiteProjectId", id] });
      queryClient.invalidateQueries({ queryKey: ["websiteProjects"] });
    },
  });
};

// RIGHT IMAGE  →  @RequestPart("rightImage")
export const useUpdateRightImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }) => {
      const fd = new FormData();
      fd.append("rightImage", file);
      return websiteApi.updateRightImage(id, fd);
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["websiteProjectId", id] });
      queryClient.invalidateQueries({ queryKey: ["websiteProjects"] });
    },
  });
};

/* =============================================================================
   MUTATIONS — Gallery
============================================================================= */

// ADD GALLERY IMAGES  →  @RequestPart("galleryImages") List<MultipartFile>
export const useAddGalleryImages = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, files }) => {
      const fd = new FormData();
      files.forEach((f) => fd.append("galleryImages", f));
      return websiteApi.addGalleryImages(id, fd);
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["websiteProjectId", id] });
      queryClient.invalidateQueries({ queryKey: ["websiteProjects"] });
    },
  });
};

// REPLACE GALLERY  →  @RequestPart("galleryImages") List<MultipartFile>
export const useReplaceGallery = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, files }) => {
      const fd = new FormData();
      files.forEach((f) => fd.append("galleryImages", f));
      return websiteApi.replaceGallery(id, fd);
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["websiteProjectId", id] });
      queryClient.invalidateQueries({ queryKey: ["websiteProjects"] });
    },
  });
};

// REORDER GALLERY  →  @RequestBody List<Map<String, Long>>
export const useReorderGallery = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, order }) => websiteApi.reorderGallery(id, order),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["websiteProjectId", id] });
    },
  });
};

// DELETE GALLERY IMAGE  →  @PathVariable Long imageId
export const useDeleteGalleryImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, imageId }) => websiteApi.deleteGalleryImage(id, imageId),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["websiteProjectId", id] });
      queryClient.invalidateQueries({ queryKey: ["websiteProjects"] });
    },
  });
};