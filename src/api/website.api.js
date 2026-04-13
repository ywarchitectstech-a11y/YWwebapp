// import axiosInstance from "./axiosInstance";

// export const websiteApi = {
//   // PUBLIC
//   getAllProjects: () => axiosInstance.get("/website/projects"),

//   getProjectBySlug: (slug) =>
//     axiosInstance.get(`/website/projects/${slug}`),

//   // ADMIN
//   getProjectById: (id) =>
//     axiosInstance.get(`/website/getprojectbyid/${id}`),

//   deleteProject: (id) =>
//     axiosInstance.delete(`/website/webprojects/deleteproject/${id}`),

//   // CREATE PROJECT (MULTIPART)
//   createProject: (formData) =>
//     axiosInstance.post("/website/webprojects/createproject", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     }),

//   // UPDATE DETAILS
//   updateProjectDetails: (id, data) =>
//     axiosInstance.patch(`/website/webprojects/${id}/details`, data),

//   // IMAGE UPDATES
//   updateHeroImage: (id, formData) =>
//     axiosInstance.patch(`/website/webprojects/${id}/hero`, formData),

//   updateFullImage: (id, formData) =>
//     axiosInstance.patch(`/website/webprojects/${id}/full`, formData),

//   updateLeftImage: (id, formData) =>
//     axiosInstance.patch(`/website/webprojects/${id}/left`, formData),

//   updateRightImage: (id, formData) =>
//     axiosInstance.patch(`/website/webprojects/${id}/right`, formData),

//   // GALLERY
//   addGalleryImages: (id, formData) =>
//     axiosInstance.patch(
//       `/website/webprojects/${id}/gallery/add`,
//       formData,
//     ),

//   replaceGallery: (id, formData) =>
//     axiosInstance.patch(
//       `/website/webprojects/${id}/gallery/replace`,
//       formData,
//     ),

//   reorderGallery: (id, order) =>
//     axiosInstance.patch(
//       `/website/webprojects/${id}/gallery/reorder`,
//       order,
//     ),

//   deleteGalleryImage: (id, imageId) =>
//     axiosInstance.delete(
//       `/website/webprojects/${id}/gallery/${imageId}`,
//     ),
// };


import axiosInstance from "./axiosInstance";

const MULTIPART = { headers: { "Content-Type": "multipart/form-data" } };

export const websiteApi = {
  // ── PUBLIC ────────────────────────────────────────────────────────────────
  getAllProjects: () =>
    axiosInstance.get("/website/projects"),

  getProjectBySlug: (slug) =>
    axiosInstance.get(`/website/projects/${slug}`),

  // ── ADMIN — Read ──────────────────────────────────────────────────────────
  getProjectById: (id) =>
    axiosInstance.get(`/website/getprojectbyid/${id}`),

  // ── ADMIN — Create ────────────────────────────────────────────────────────
  // Backend: @RequestPart("projectData") + image parts
  createProject: (formData) =>
    axiosInstance.post("/website/webprojects/createproject", formData, MULTIPART),

  // ── ADMIN — Update Details (JSON) ─────────────────────────────────────────
  updateProjectDetails: (id, data) =>
    axiosInstance.patch(`/website/webprojects/${id}/details`, data),

  // ── ADMIN — Image Updates (multipart, one file each) ──────────────────────
  // Backend: @RequestPart("heroImage")
  updateHeroImage: (id, formData) =>
    axiosInstance.patch(`/website/webprojects/${id}/hero`, formData, MULTIPART),

  // Backend: @RequestPart("fullImage")
  updateFullImage: (id, formData) =>
    axiosInstance.patch(`/website/webprojects/${id}/full`, formData, MULTIPART),

  // Backend: @RequestPart("leftImage")
  updateLeftImage: (id, formData) =>
    axiosInstance.patch(`/website/webprojects/${id}/left`, formData, MULTIPART),

  // Backend: @RequestPart("rightImage")
  updateRightImage: (id, formData) =>
    axiosInstance.patch(`/website/webprojects/${id}/right`, formData, MULTIPART),

  // ── ADMIN — Gallery ───────────────────────────────────────────────────────
  // Backend: @RequestPart("galleryImages") List<MultipartFile>
  addGalleryImages: (id, formData) =>
    axiosInstance.patch(`/website/webprojects/${id}/gallery/add`, formData, MULTIPART),

  replaceGallery: (id, formData) =>
    axiosInstance.patch(`/website/webprojects/${id}/gallery/replace`, formData, MULTIPART),

  // Backend: @RequestBody List<Map<String, Long>>  (JSON)
  reorderGallery: (id, order) =>
    axiosInstance.patch(`/website/webprojects/${id}/gallery/reorder`, order),

  // Backend: @PathVariable Long imageId
  deleteGalleryImage: (id, imageId) =>
    axiosInstance.delete(`/website/webprojects/${id}/gallery/${imageId}`),

  // ── ADMIN — Delete Project ────────────────────────────────────────────────
  deleteProject: (id) =>
    axiosInstance.delete(`/website/webprojects/deleteproject/${id}`),
};